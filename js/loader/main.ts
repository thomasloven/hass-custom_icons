import { svg } from "lit";
import { hass, renderIcon } from "../helpers";

const icon_cache = {};
const list_cache = {};
const pending = {};
(window as any).icon_cache = icon_cache;

const EMPTY_ICON = { path: "", viewBox: [0, 0, 0, 0] };
const RETRIES = 3;
// home-assistant-js-websocket rejects with this code when the connection drops
const ERR_CONNECTION_LOST = 3;

const _fetchIcon = async (iconSet: string, iconName: string) => {
  // The icon is requested directly. Previously the full icon list of the set
  // was downloaded first just to check that the name exists (16k names for
  // material-symbols) before even the first icon could be shown. The backend
  // now answers unknown icons with an error, so that check is not needed.
  for (let attempt = 0; attempt < RETRIES; attempt++) {
    try {
      const conn = (await hass()).connection;
      const icon = await conn.sendMessagePromise({
        type: "custom_icons/icon",
        set: iconSet,
        icon: iconName,
      });
      return renderIcon(icon) ?? EMPTY_ICON;
    } catch (err) {
      // Error from the backend (unknown icon, broken SVG...) - retrying won't help
      if (err?.code !== undefined && err.code !== ERR_CONNECTION_LOST)
        return EMPTY_ICON;
      // Connection lost (e.g. HA restart, app resumed from background) -
      // wait for the reconnect and try again
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
  return EMPTY_ICON;
};

const getIcon = (iconSet: string, iconName: string) => {
  if (iconName.includes("#")) {
    iconName = iconName.split("#")[0];
  }
  const cached = icon_cache[iconSet]?.[iconName];
  if (cached) return Promise.resolve(cached);

  // Icons used to be fetched through a serial queue: each icon waited for
  // every icon requested before it (very slow in the icon picker or on slow
  // devices), and if a single request failed the queue worker crashed and no
  // more custom icons loaded until the page was reloaded.
  // Now requests run in parallel, never reject, and elements asking for the
  // same icon share one request. Failed icons are not cached, so they are
  // retried the next time they are requested.
  const key = `${iconSet}:${iconName}`;
  if (!pending[key]) {
    pending[key] = _fetchIcon(iconSet, iconName).then((icon) => {
      if (icon !== EMPTY_ICON) icon_cache[iconSet][iconName] = icon;
      delete pending[key];
      return icon;
    });
  }
  return pending[key];
};

const _preload_cache = async (iconSet: string) => {
  const conn = (await hass()).connection;
  const icons = await conn.sendMessagePromise({
    type: "custom_icons/icon_cache",
    set: iconSet,
  });

  for (const icon of icons) {
    if (!icon) continue; // Older versions could cache null for missing icons
    icon_cache[iconSet][icon.icon] = renderIcon(icon);
  }
};

const getIconList = (iconSet: string) => {
  if (!list_cache[iconSet]) {
    list_cache[iconSet] = hass()
      .then((h) =>
        h.connection.sendMessagePromise({
          type: "custom_icons/list",
          set: iconSet,
        })
      )
      .catch(() => {
        delete list_cache[iconSet];
        return [];
      });
  }
  return list_cache[iconSet];
};

// The icon sets are only known after a websocket round trip, so ha-icon
// elements can be rendered before they are registered in window.customIcons
// (typically on page load or in the companion apps). Home Assistant then marks
// the element as a legacy icon, renders nothing and never tries again; the
// _loadIcon patch below only helps elements loaded after it was installed.
// Once the sets are registered, find those elements and load them again.
const reloadEarlyIcons = (sets: string[]) => {
  const visit = (root: Document | ShadowRoot | Element) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.localName === "ha-icon") {
        const icon = (el as any).icon;
        // Only the elements Home Assistant gave up on. Others are already
        // being handled by the _loadIcon patch and must not be loaded twice.
        if (
          (el as any)._legacy &&
          typeof icon === "string" &&
          sets.includes(icon.split(":")[0])
        ) {
          (el as any)._legacy = false;
          (el as any)._loadIcon?.();
        }
      }
      if (el.shadowRoot) visit(el.shadowRoot);
    }
  };
  visit(document);
};

const setup = async () => {
  const conn = (await hass()).connection;
  const sets = await conn.sendMessagePromise({
    type: "custom_icons/activesets",
  });

  const wnd = window as any;

  if (!("customIcons" in wnd)) {
    wnd.customIcons = {};
  }

  for (const prefix of sets) {
    icon_cache[prefix] = {};
    wnd.customIcons[prefix] = {
      getIcon: (iconName) => getIcon(prefix, iconName),
      getIconList: () => getIconList(prefix),
    };
    _preload_cache(prefix);
  }

  // Backwards compatibility with hass-fontawesome

  const add_alias = (set, alias) => {
    if (sets.includes(set)) {
      wnd.customIcons[alias] = {
        getIcon: (iconName) => getIcon(set, iconName),
        getIconList: () => [],
      };
    }
  };
  add_alias("local", "fapro");
  add_alias("fa6-regular", "far");
  add_alias("fa6-solid", "fas");
  add_alias("fa6-brands", "fab");

  customElements
    .whenDefined("ha-icon")
    .then(() => reloadEarlyIcons([...sets, "fapro", "far", "fas", "fab"]));
};

const customIconRegistered = setup().catch(() => console.error("Couldn't add custom icons to frontend"));

interface Icon {
  path: string;
  secondaryPath: string;
  viewBox: string;
}
// Extended interface for custom_icons
interface CustomIcon extends Icon {
  format: "custom_icons";
  innerSVG: string;
}

// Fullcolor support patch of ha-icon
//
// Full-color icons are drawn by adding a <g class="customIcon"> layer inside
// the <svg> rendered by ha-svg-icon. Previously this layer was added in
// _setCustomPath and removed by a callback scheduled in _loadIcon, and the two
// raced: the removal was guarded by `this.icon.format !== "custom_icons"`, but
// this.icon is a string, so it ran for every icon - including custom ones.
// When it ran after the layer had been added, the icon stayed blank (sized
// correctly, but empty) until it was loaded again. A typo
// (`this.UpdateComplete`) made the ordering even less predictable.
//
// Now each ha-icon stores the full-color SVG of the icon it is *currently*
// showing (_customIconSVG), and a single function makes the layer match it.
// That function runs whenever the icon arrives and after every render, so it
// no longer matters in which order things happen.

const SVG_NS = "http://www.w3.org/2000/svg";

const syncCustomLayer = async (haIcon) => {
  const svgIcon = haIcon.shadowRoot?.querySelector("ha-svg-icon");
  if (!svgIcon) return; // Legacy icon or not rendered yet
  await svgIcon.updateComplete;
  const root = svgIcon.shadowRoot?.querySelector("svg");
  if (!root) return;

  const wanted = haIcon._customIconSVG;
  let layer = root.querySelector(".customIcon");
  if (!wanted) {
    layer?.remove();
    return;
  }
  if (!layer) {
    layer = document.createElementNS(SVG_NS, "g");
    layer.setAttribute("class", "customIcon");
    root.appendChild(layer);
  }
  if (layer._customIconSVG !== wanted) {
    layer.innerHTML = wanted;
    layer._customIconSVG = wanted;
  }
};

customElements.whenDefined("ha-icon").then(() => {
  const HaIcon = customElements.get("ha-icon");

  const o_setCustomPath = HaIcon.prototype._setCustomPath;
  HaIcon.prototype._setCustomPath = async function (promise, requestedIcon) {
    await o_setCustomPath?.bind(this)?.(promise, requestedIcon);

    const icon: CustomIcon = await promise;
    // Another icon was requested while this one was loading
    if (requestedIcon !== this.icon) return;

    if (!icon?.innerSVG || icon.format !== "custom_icons") {
      this._customIconSVG = undefined;
    } else {
      this._customIconSVG = icon.innerSVG;
      // The layer draws the icon - don't draw the single-color path as well
      this._path = undefined;
      this._secondaryPath = undefined;
    }
    await this.updateComplete;
    syncCustomLayer(this);
  };

  const o_loadIcon = HaIcon.prototype._loadIcon;
  HaIcon.prototype._loadIcon = async function () {
    // The icon changed: the previous full-color layer no longer applies.
    // Cleared synchronously, so it can't overwrite the state for the new icon.
    this._customIconSVG = undefined;
    syncCustomLayer(this);

    await customIconRegistered;
    await o_loadIcon?.call(this);
  };

  // Re-apply the layer after every render. This also covers ha-svg-icon being
  // replaced, e.g. when an icon rendered as legacy is loaded again.
  const o_updated = HaIcon.prototype.updated;
  HaIcon.prototype.updated = function (changedProps) {
    o_updated?.call(this, changedProps);
    syncCustomLayer(this);
  };
});

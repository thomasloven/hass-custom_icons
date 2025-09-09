import { svg } from "lit";
import { hass, renderIcon } from "../helpers";

const icon_cache = {};
const list_cache = {};
(window as any).icon_cache = icon_cache;

const getIconQueue = [];
const _getIcon = async (iconSet: string, iconName: string) => {
  if (iconName.includes("#")) {
    iconName = iconName.split("#")[0];
  }
  if (!icon_cache[iconSet]?.[iconName]) {
    const list = await getIconList(iconSet);
    if (!list.some((i) => i.name == iconName)) {
      return { path: "", viewBox: [0, 0, 0, 0] };
    }
    const conn = (await hass()).connection;
    const icon = await conn.sendMessagePromise({
      type: "custom_icons/icon",
      set: iconSet,
      icon: iconName,
    });

    icon_cache[iconSet][iconName] = renderIcon(icon);
  }
  return icon_cache[iconSet][iconName];
};

const _preload_cache = async (iconSet: string) => {
  const conn = (await hass()).connection;
  const icons = await conn.sendMessagePromise({
    type: "custom_icons/icon_cache",
    set: iconSet,
  });

  for (const icon of icons) {
    icon_cache[iconSet][icon.icon] = renderIcon(icon);
  }
};

const queueWorker = async () => {
  const work = getIconQueue.shift();
  if (work !== undefined) {
    let resolve, iconSet, iconName;
    [iconSet, iconName, resolve] = work;
    const icon = await _getIcon(iconSet, iconName);
    resolve(icon);
    setTimeout(queueWorker, 1);
  } else {
    setTimeout(queueWorker, 50);
  }
};

const getIcon = (iconSet: string, iconName: string) => {
  const promise = new Promise((resolve) =>
    getIconQueue.push([iconSet, iconName, resolve])
  );

  return promise;
};

queueWorker();

const getIconList = async (iconSet: string) => {
  if (!list_cache[iconSet]) {
    const conn = (await hass()).connection;
    list_cache[iconSet] = await conn.sendMessagePromise({
      type: "custom_icons/list",
      set: iconSet,
    });
  }
  return list_cache[iconSet];
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
};

setup();

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
customElements.whenDefined("ha-icon").then(() => {
  const HaIcon = customElements.get("ha-icon");
  const o_setCustomPath = HaIcon.prototype._setCustomPath;
  HaIcon.prototype._setCustomPath = async function (promise, requestedIcon) {
    await o_setCustomPath?.bind(this)?.(promise, requestedIcon);

    const icon: CustomIcon = await promise;
    if (requestedIcon !== this.icon) return;

    if (!icon.innerSVG || icon.format !== "custom_icons") return;

    await this.UpdateComplete;
    const el = this.shadowRoot.querySelector("ha-svg-icon");
    await el?.updateComplete;

    const root = el?.shadowRoot.querySelector("svg");
    if (root) {
      this._path = undefined;
      this._secondaryPath = undefined;

      let svg_g = root.querySelector(".customIcon");
      if (!svg_g) {
        svg_g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg_g.setAttribute("class", "customIcon");
        root.appendChild(svg_g);
      }
      svg_g.innerHTML = icon.innerSVG;
    }
  };

  const o_loadIcon = HaIcon.prototype._loadIcon;
  HaIcon.prototype._loadIcon = async function () {
    await o_loadIcon?.bind(this)?.();

    if (this.icon && this.icon.format !== "custom_icons") {
      this.updateComplete.then(async () => {
        const el = this.shadowRoot.querySelector("ha-svg-icon");
        await el?.updateComplete;
        const root = el?.shadowRoot.querySelector(".customIcon");
        if (root) {
          root.remove();
        }
      });
    }

    // If the icon set is not found in window.cuustomIcons _loadIcon
    // sets _legacy. So if that is set, try reloading the icon again
    // after a delay. But only once.
    // This makes things more stable on first load
    if (this._legacy && !this._legacyReloaded) {
      window.setTimeout(() => {
        this._legacy = false;
        this._legacyReloaded = true;
        this._loadIcon();
      }, 1000);
    }
  };
});

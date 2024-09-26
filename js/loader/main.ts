import { iconToSVG } from "@iconify/utils";
import { hass } from "../helpers";

const icon_cache = {};

if (!("customIconsets" in window)) {
  (window as any).customIconsets = {};
}
if (!("customIcons" in window)) {
  (window as any).customIcons = {};
}

const getIcon = async (iconSet, iconName) => {
  if (!icon_cache[iconSet]?.[iconName]) {
    const conn = (await hass()).connection;
    const icon = await conn.sendMessagePromise({
      type: "iconify/icon",
      set: iconSet,
      icon: iconName,
    });

    const renderData = iconToSVG(icon);

    icon_cache[iconSet][iconName] = {
      path: "",
      viewBox: renderData.viewBox,
      format: "iconify",
      innerSVG: renderData.body,
    };
  }
  return icon_cache[iconSet][iconName];
};

const getIconList = async (iconSet) => {
  const conn = (await hass()).connection;
  const list = await conn.sendMessagePromise({
    type: "iconify/list",
    set: iconSet,
  });
  return list.map((i) => ({
    name: i,
  }));
};

const setup = async () => {
  const conn = (await hass()).connection;
  const sets = await conn.sendMessagePromise({
    type: "iconify/activesets",
  });

  for (const prefix of sets) {
    icon_cache[prefix] = {};
    (window as any).customIcons[prefix] = {
      getIcon: (iconName) => getIcon(prefix, iconName),
      getIconList: () => getIconList(prefix),
    };
  }
};

setup();

// Fullcolor support patch
customElements.whenDefined("ha-icon").then((HaIcon) => {
  const o_setCustomPath = HaIcon.prototype._setCustomPath;
  HaIcon.prototype._setCustomPath = async function (promise, requestedIcon) {
    await o_setCustomPath?.bind(this)?.(promise, requestedIcon);

    const icon = await promise;
    if (requestedIcon !== this.icon) return;

    if (!icon.innerSVG || icon.format !== "iconify") return;

    await this.UpdateComplete;
    const el = this.shadowRoot.querySelector("ha-svg-icon");
    await el?.updateComplete;

    const root = el?.shadowRoot.querySelector("svg");
    if (root) {
      this._path = undefined;
      this._secondaryPath = undefined;
      root.innerHTML = icon.innerSVG;
    }
  };

  const o_loadIcon = HaIcon.prototype._loadIcon;
  HaIcon.prototype._loadIcon = async function () {
    this._loadIcon = o_loadIcon.bind(this); // Override only the first run
    await this._loadIcon();

    // If the icon set is not found in window.cuustomIcons _loadIcon
    // sets _legacy. So if that is set, try reloading the icon again
    // after a delay. But only once.
    if (this._legacy) {
      window.setTimeout(() => {
        this._legacy = false;
        this._loadIcon();
      }, 1000);
    }
  };
});

const defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
const defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});

const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations
});

const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}

function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index = content.indexOf("<" + tag);
  while (index >= 0) {
    const start = content.indexOf(">", index);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) {
      break;
    }
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) {
      break;
    }
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}

const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = wrapSVGContent(
        body,
        '<g transform="' + transformations.join(" ") + '">',
        "</g>"
      );
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  const viewBox = [box.left, box.top, boxWidth, boxHeight];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
}

async function hass_base_el() {
    await Promise.race([
        customElements.whenDefined("home-assistant"),
        customElements.whenDefined("hc-main"),
    ]);
    const element = customElements.get("home-assistant")
        ? "home-assistant"
        : "hc-main";
    while (!document.querySelector(element))
        await new Promise((r) => window.setTimeout(r, 100));
    return document.querySelector(element);
}
async function hass() {
    const base = await hass_base_el();
    while (!base.hass)
        await new Promise((r) => window.setTimeout(r, 100));
    return base.hass;
}
const renderIcon = (icon) => {
    var _a, _b;
    if (!icon)
        return null;
    let renderedIcon;
    if (icon.renderer == "iconify") {
        renderedIcon = iconToSVG(icon);
    }
    else {
        renderedIcon = icon;
        renderedIcon.attributes = {
            height: "1em",
            width: "1em",
            viewBox: icon.viewBox.join(" "),
        };
    }
    return {
        path: (_a = icon.path) !== null && _a !== void 0 ? _a : "",
        secondaryPath: (_b = icon.path2) !== null && _b !== void 0 ? _b : "",
        viewBox: renderedIcon.viewBox,
        format: "custom_icons",
        innerSVG: renderedIcon.body,
        attributes: renderedIcon.attributes,
    };
};

const icon_cache = {};
const list_cache = {};
window.icon_cache = icon_cache;
const getIconQueue = [];
const _getIcon = async (iconSet, iconName) => {
    var _a;
    if (iconName.includes("#")) {
        iconName = iconName.split("#")[0];
    }
    if (!((_a = icon_cache[iconSet]) === null || _a === void 0 ? void 0 : _a[iconName])) {
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
const _preload_cache = async (iconSet) => {
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
    }
    else {
        setTimeout(queueWorker, 50);
    }
};
const getIcon = (iconSet, iconName) => {
    const promise = new Promise((resolve) => getIconQueue.push([iconSet, iconName, resolve]));
    return promise;
};
queueWorker();
const getIconList = async (iconSet) => {
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
    const wnd = window;
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
                getIconList: () => getIconList(set),
            };
        }
    };
    add_alias("custom", "fapro");
    add_alias("fa6-regular", "far");
    add_alias("fa6-solid", "fas");
    add_alias("fa6-brands", "fab");
};
setup();
// Fullcolor support patch of ha-icon
customElements.whenDefined("ha-icon").then(() => {
    const HaIcon = customElements.get("ha-icon");
    const o_setCustomPath = HaIcon.prototype._setCustomPath;
    HaIcon.prototype._setCustomPath = async function (promise, requestedIcon) {
        var _a;
        await ((_a = o_setCustomPath === null || o_setCustomPath === void 0 ? void 0 : o_setCustomPath.bind(this)) === null || _a === void 0 ? void 0 : _a(promise, requestedIcon));
        const icon = await promise;
        if (requestedIcon !== this.icon)
            return;
        if (!icon.innerSVG || icon.format !== "custom_icons")
            return;
        await this.UpdateComplete;
        const el = this.shadowRoot.querySelector("ha-svg-icon");
        await (el === null || el === void 0 ? void 0 : el.updateComplete);
        const root = el === null || el === void 0 ? void 0 : el.shadowRoot.querySelector("svg");
        if (root) {
            this._path = undefined;
            this._secondaryPath = undefined;
            const svg_g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svg_g.setAttribute("class", "customIcon");
            svg_g.innerHTML = icon.innerSVG;
            root.appendChild(svg_g);
        }
    };
    const o_loadIcon = HaIcon.prototype._loadIcon;
    HaIcon.prototype._loadIcon = async function () {
        var _a;
        await ((_a = o_loadIcon === null || o_loadIcon === void 0 ? void 0 : o_loadIcon.bind(this)) === null || _a === void 0 ? void 0 : _a());
        if (this.icon && this.icon.format !== "custom_icons") {
            this.updateComplete.then(async () => {
                const el = this.shadowRoot.querySelector("ha-svg-icon");
                await (el === null || el === void 0 ? void 0 : el.updateComplete);
                const root = el === null || el === void 0 ? void 0 : el.shadowRoot.querySelector(".customIcon");
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

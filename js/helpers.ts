import { iconToSVG, iconToHTML } from "@iconify/utils";

export async function hass_base_el() {
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

export async function hass() {
  const base: any = await hass_base_el();
  while (!base.hass) await new Promise((r) => window.setTimeout(r, 100));
  return base.hass;
}

export const loadConfigDashboard = async () => {
  await customElements.whenDefined("partial-panel-resolver");
  const ppResolver = document.createElement("partial-panel-resolver");
  const routes = (ppResolver as any)._getRoutes([
    {
      component_name: "config",
      url_path: "a",
    },
  ]);
  await routes?.routes?.a?.load?.();
  await customElements.whenDefined("ha-panel-config");
  const configRouter: any = document.createElement("ha-panel-config");
  await configRouter?.routerOptions?.routes?.dashboard?.load?.(); // Load ha-config-dashboard
  await configRouter?.routerOptions?.routes?.general?.load?.(); // Load ha-settings-row
  await configRouter?.routerOptions?.routes?.entities?.load?.(); // Load ha-data-table
  await customElements.whenDefined("ha-config-dashboard");
};

export const renderIcon = (icon) => {
  if (!icon) return null;

  let renderedIcon;
  if (icon.renderer == "iconify") {
    renderedIcon = iconToSVG(icon);
  } else {
    renderedIcon = icon;
    renderedIcon.attributes = {
      height: "1em",
      width: "1em",
      viewBox: icon.viewBox.join(" "),
    };
  }

  return {
    path: icon.path ?? "",
    secondaryPath: icon.path2 ?? "",
    viewBox: renderedIcon.viewBox,
    format: "custom_icons",
    innerSVG: renderedIcon.body,
    attributes: renderedIcon.attributes,
  };
};

export const renderIconHTML = (icon) => {
  const icn = renderIcon(icon);
  if (!icn) return "";

  return iconToHTML(icn.innerSVG, icn.attributes);
};

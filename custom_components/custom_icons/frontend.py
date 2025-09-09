import voluptuous as vol
import logging
from collections import defaultdict

from homeassistant.components import panel_custom, websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from . import iconset_fapro, iconset_iconify, iconset_local, iconset_webfont

from .iconset_base import IconSetCollection

LOGGER = logging.getLogger(__name__)

LOADER_URL = f"/{DOMAIN}/main.js"
LOADER_JS = f"custom_components/{DOMAIN}/loader.js"

PANEL_URL = f"/{DOMAIN}/panel.js"
PANEL_JS = f"custom_components/{DOMAIN}/panel.js"


collections: list[IconSetCollection] = [
    iconset_local.LocalSet(),
    iconset_fapro.FontawesomeSets(),
    iconset_webfont.WebfontSets(),
    iconset_iconify.IconifySets(),
]

icon_cache = defaultdict(dict)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/sets"})
@websocket_api.async_response
@callback
async def ws_get_icon_sets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Get list of all available icon sets"""
    data = {}
    for collection in collections:
        data.update(**(await collection.sets(hass)))
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/activesets"})
@callback
def ws_get_active_sets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Get the list of activated icon sets"""
    config = hass.config_entries.async_entries(DOMAIN)
    if not config:
        connection.send_result(msg["id"])
        return

    config = config[0]
    data = [k for k, v in config.data.items() if v]
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/select",
        vol.Required("set"): str,
        vol.Required("active"): bool,
    }
)
@websocket_api.require_admin
@callback
def set_icon_sets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Enable or disable an icon set"""
    config = hass.config_entries.async_entries(DOMAIN)
    if not config:
        connection.send_result(msg["id"])
        return

    config = config[0]
    data = config.data.copy()

    data[msg["set"]] = msg["active"]

    hass.config_entries.async_update_entry(config, data=data)

    for collection in collections:
        collection.flush()

    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/list", vol.Required("set"): str}
)
@websocket_api.async_response
@callback
async def ws_get_icon_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Get the list of icons in a set"""
    prefix = msg["set"]

    lst = []
    for collection in collections:
        if prefix in await collection.prefixes(hass):
            lst = await collection.list(hass, prefix)

    connection.send_result(msg["id"], lst)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/icon",
        vol.Required("set"): str,
        vol.Required("icon"): str,
    }
)
@websocket_api.async_response
@callback
async def ws_get_icon(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Get an icon"""
    prefix = msg["set"]
    icon = msg["icon"]

    icn = icon_cache[prefix].get(icon, None)
    if icn is None:
        for collection in collections:
            if prefix in await collection.prefixes(hass):
                icn = await collection.icon(hass, prefix, icon)
                icn.update({"prefix": prefix, "icon": icon})
                icon_cache[prefix][icon] = icn

    connection.send_result(msg["id"], icn)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/icon_cache",
        vol.Required("set"): str,
    }
)
@websocket_api.async_response
@callback
async def ws_get_cached_icons(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Get all cached icons"""
    prefix = msg["set"]
    connection.send_result(msg["id"], list(icon_cache[prefix].values()))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/iconify_download"})
@websocket_api.require_admin
@websocket_api.async_response
@callback
async def ws_download_iconify_sets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Download iconify icons"""
    await iconset_iconify.download_data(hass, True)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/flush_icons"})
@websocket_api.require_admin
@websocket_api.async_response
@callback
async def ws_flush_icons(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Reload all icons"""
    for collection in collections:
        collection.flush()
    icon_cache.clear()

    connection.send_result(msg["id"])


async def async_register_custom_icons_frontend(hass: HomeAssistant):

    websocket_api.async_register_command(hass, ws_get_icon_sets)
    websocket_api.async_register_command(hass, ws_get_active_sets)
    websocket_api.async_register_command(hass, set_icon_sets)

    websocket_api.async_register_command(hass, ws_get_icon_list)
    websocket_api.async_register_command(hass, ws_get_icon)
    websocket_api.async_register_command(hass, ws_get_cached_icons)

    websocket_api.async_register_command(hass, ws_download_iconify_sets)
    websocket_api.async_register_command(hass, ws_flush_icons)

    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(LOADER_URL, hass.config.path(LOADER_JS)),
            StaticPathConfig(PANEL_URL, hass.config.path(PANEL_JS)),
        ]
    )

    add_extra_js_url(hass, LOADER_URL)

    await panel_custom.async_register_panel(
        hass=hass,
        frontend_url_path=DOMAIN + "-config",
        config_panel_domain=DOMAIN,
        webcomponent_name="custom-icons-panel",
        module_url=PANEL_URL,
        embed_iframe=False,
        require_admin=True,
    )

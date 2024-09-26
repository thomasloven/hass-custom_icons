import voluptuous as vol
import logging

from homeassistant.components import panel_custom, websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .iconify import get_data, download_data, get_iconlist, get_icon, flush

LOGGER = logging.getLogger(__name__)

LOADER_URL = f"/{DOMAIN}/main.js"
LOADER_JS = f"custom_components/{DOMAIN}/loader.js"

PANEL_URL = f"/{DOMAIN}/panel.js"
PANEL_JS = f"custom_components/{DOMAIN}/panel.js"

# https://github.com/home-assistant/core/blob/6e4e5ba8c52b0c0c3d86deeaacde06754cb5689e/homeassistant/components/dynalite/panel.py


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/activesets"})
@websocket_api.require_admin
@callback
def ws_get_active_sets(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
):
    config = hass.config_entries.async_entries(DOMAIN)
    if not config:
        connection.send_result(msg["id"])
        return

    config = config[0]
    data = [k for k, v in config.data.items() if v]
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/list", vol.Required("set"): str}
)
@websocket_api.async_response
@callback
async def ws_get_icon_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
):
    lst = await get_iconlist(hass, msg["set"])
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
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
):
    icn = await get_icon(hass, msg["set"], msg["icon"])
    connection.send_result(msg["id"], icn)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/download"})
@websocket_api.require_admin
@websocket_api.async_response
@callback
async def ws_download_icon_sets(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
):
    await download_data(hass, True)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/sets"})
@websocket_api.require_admin
@websocket_api.async_response
@callback
async def ws_get_icon_sets(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
):
    data = await get_data(hass)
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
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
):
    config = hass.config_entries.async_entries(DOMAIN)
    if not config:
        connection.send_result(msg["id"])
        return

    config = config[0]
    data = config.data.copy()

    data[msg["set"]] = msg["active"]

    hass.config_entries.async_update_entry(config, data=data)

    flush()
    connection.send_result(msg["id"])


async def async_register_iconify_frontend(hass: HomeAssistant):

    websocket_api.async_register_command(hass, ws_get_active_sets)
    websocket_api.async_register_command(hass, ws_get_icon_list)
    websocket_api.async_register_command(hass, ws_get_icon)

    websocket_api.async_register_command(hass, ws_download_icon_sets)
    websocket_api.async_register_command(hass, ws_get_icon_sets)
    websocket_api.async_register_command(hass, set_icon_sets)

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
        webcomponent_name="iconify-panel",
        module_url=PANEL_URL,
        embed_iframe=False,
        require_admin=True,
    )

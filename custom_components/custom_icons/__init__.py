import os

from .const import ICON_PATH
from .frontend import async_register_custom_icons_frontend


async def async_setup(hass, config):
    icon_dir = hass.config.path(ICON_PATH)
    if not os.path.exists(icon_dir):
        os.mkdir(icon_dir)

    await async_register_custom_icons_frontend(hass)
    return True


async def async_setup_entry(hass, entry):
    return True


async def async_remove_entry(hass, entry):
    return True

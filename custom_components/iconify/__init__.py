from .frontend import async_register_iconify_frontend


async def async_setup(hass, config):

    await async_register_iconify_frontend(hass)
    return True


async def async_setup_entry(hass, entry):
    return True


async def async_remove_entry(hass, entry):
    return True

import aiofiles
import json
from collections import defaultdict

from homeassistant.core import HomeAssistant

from .const import ICON_PATH, DOMAIN


fapro_data_cache = None


def flush():
    global fapro_data_cache
    fapro_data_cache = None


async def load_data_file(hass: HomeAssistant):
    filepath = hass.config.path(ICON_PATH + "/fontawesome.json")
    async with aiofiles.open(filepath, "r") as fp:
        js = json.loads(await fp.read())
    return js


async def load_data(hass: HomeAssistant):
    global fapro_data_cache
    if fapro_data_cache:
        return fapro_data_cache

    js = await load_data_file(hass)

    icon_data = defaultdict(list)
    for k, v in js.items():
        for style in v.get("styles", []):
            icon_data[style].append(
                {
                    "name": k,
                    "keywords": list(map(str, v.get("search", {}).get("terms", []))),
                }
            )

    fapro_data_cache = icon_data

    return fapro_data_cache


async def get_data(hass: HomeAssistant):

    data = await load_data(hass)

    config = hass.config_entries.async_entries(DOMAIN)
    config = config[0] if config else {}

    retval = {}
    for k, v in data.items():
        prefix = f"fapro-{k}"
        retval[prefix] = {
            "name": f"FontAwesome {k}",
            "prefix": prefix,
            "total": len(v),
            "active": config.data.get(f"fapro-{k}"),
        }
    return retval


async def get_iconlist(hass: HomeAssistant, set: str):

    data = await load_data(hass)

    style = "duotone" if set == "fapro-duotone" else "light"

    return data.get(style, [])


async def get_icon(hass: HomeAssistant, set: str, name: str):

    style = set.removeprefix("fapro-")

    js = await load_data_file(hass)

    data = js.get(name, {}).get("svg", {}).get(style)
    if not data:
        return None
    pth = data.get("path")
    pth2 = None
    if isinstance(pth, list):
        pth2 = pth[1]
        pth = pth[0]
    return {
        "renderer": None,
        "viewBox": data.get("viewBox"),
        "path": pth,
        "path2": pth2,
        "body": data.get("raw"),
    }

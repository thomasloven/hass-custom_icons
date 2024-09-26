import aiofiles
import aiohttp
import os
import zipfile
import json

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN, REPO_URL, REPO_FILENAME

data_cache = None


def flush():
    global data_cache
    data_cache = None


async def download_data(hass: HomeAssistant, force: bool = False):

    session: aiohttp.ClientSession = async_get_clientsession(hass)

    targetpath = hass.config.path(f"custom_components/{DOMAIN}/data")
    target = targetpath + "/" + REPO_FILENAME

    if os.path.isfile(target) and not force:
        return target

    if not os.path.exists(targetpath):
        os.mkdir(targetpath)

    # try:
    request = await session.get(url=REPO_URL)

    if request.status == 200:
        async with aiofiles.open(target, "wb") as fp:
            await fp.write(await request.read())

        flush()
        return target

    return None
    # except:
    # pass


async def get_data(hass: HomeAssistant):
    global data_cache

    if data_cache:
        return data_cache

    filepath = await download_data(hass)

    if not filepath:
        return None

    zf = zipfile.ZipFile(filepath)
    data = zipfile.Path(zf) / "icon-sets-master" / "json"

    config = hass.config_entries.async_entries(DOMAIN)
    config = config[0] if config else {}

    files = {}
    for f in data.iterdir():
        js = json.load(f.open())

        samples = js.get("info", {}).get("samples", [])
        samples = [_get_icon(js, s) for s in samples]

        files[js["prefix"]] = {
            **js["info"],
            "filename": f.name,
            "active": config.data.get(js["prefix"]),
            "sample_icons": samples,
        }
    data_cache = files
    return files


async def get_iconlist(hass: HomeAssistant, set: str):
    data = await get_data(hass)
    data = data.get(set)
    if not data:
        return []

    filepath = await download_data(hass)

    if not filepath:
        return None

    zf = zipfile.ZipFile(filepath)
    data = zipfile.Path(zf) / "icon-sets-master" / "json" / data["filename"]

    js = json.load(data.open())

    return list(js.get("icons", {}).keys())


def _get_icon(js: dict, name: str):
    data = {
        "left": js.get("left", 0),
        "top": js.get("top", 0),
        "width": js.get("width", 16),
        "height": js.get("height", 16),
        "rotate": js.get("rotate", 0),
        "vFlip": js.get("vFlip", False),
        "hFlip": js.get("hFlip", False),
    }

    data.update(js.get("icons", {}).get(name, {}))
    return data


async def get_icon(hass: HomeAssistant, set: str, name: str):
    data = await get_data(hass)
    data = data.get(set)
    if not data:
        return []

    filepath = await download_data(hass)

    if not filepath:
        return None

    zf = zipfile.ZipFile(filepath)
    data = zipfile.Path(zf) / "icon-sets-master" / "json" / data["filename"]

    js = json.load(data.open())

    data = _get_icon(js, name)

    return data

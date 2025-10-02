import asyncio
import aiohttp
import zipfile
import json
import os
import random
import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .iconset_base import IconSetCollection, IconData, IconSetInfo, IconListItem

from .const import DOMAIN, ICON_PATH


LOGGER = logging.getLogger(__name__)

ICONIFY_REPO_URL = "https://github.com/iconify/icon-sets/archive/refs/heads/master.zip"
ICONIFY_REPO_FILENAME = "iconify-icon-sets-master.zip"


def _save_file(path: str, data: str | bytes):
    with open(path, "wb") as fp:
        fp.write(data)


def _load_file(path: str) -> zipfile.ZipFile:
    return zipfile.ZipFile(path)


async def download_data(hass: HomeAssistant, force: bool = False):

    targetpath = hass.config.path(ICON_PATH)
    target = targetpath + "/" + ICONIFY_REPO_FILENAME

    if os.path.isfile(target) and not force:
        return target

    if not force:
        return None

    session = aiohttp.ClientSession = async_get_clientsession(hass)

    request = await session.get(url=ICONIFY_REPO_URL)
    if request.status == 200:
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, _save_file, target, await request.read())

        return target

    return None


async def _get_data_files(hass: HomeAssistant) -> zipfile.Path:

    path = await download_data(hass)
    if not path:
        return None

    loop = asyncio.get_running_loop()
    zf = await loop.run_in_executor(None, _load_file, path)
    data = zipfile.Path(zf) / "icon-sets-master" / "json"

    return data


class IconifySets(IconSetCollection):

    def __init__(self):
        self.cache: dict[str, IconSetInfo] = {}
        self.prefix_cache = None
        self.data_cache: dict = {}

    def flush(self) -> None:
        self.cache = {}
        self.prefix_cache = None
        self.data_cache = {}

    async def data(self, hass, prefix="/"):
        if not "/" in self.data_cache:
            self.data_cache["/"] = await _get_data_files(hass)
        if not prefix in self.data_cache:
            data = self.data_cache["/"] / f"{prefix}.json"
            self.data_cache[prefix] = json.load(data.open())

        return self.data_cache[prefix]

    async def sets(self, hass: HomeAssistant) -> dict[str, IconSetInfo]:

        if self.cache:
            return self.cache

        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        data = await self.data(hass)
        if not data:
            return {}
        for f in data.iterdir():
            js = json.load(f.open())

            prefix = js["prefix"]

            samples = js.get("info", {}).get("samples", [])
            if not samples:
                icons = list(js.get("icons", {}).keys())
                if len(icons):
                    samples = random.sample(icons, min(6, len(icons)))
            samples = [await self.icon(hass, prefix, icon) for icon in samples]

            self.cache[prefix] = {
                **js["info"],
                "prefix": prefix,
                "active": config.data.get(prefix, False),
                "sample_icons": samples,
            }

        return self.cache

    async def prefixes(self, hass: HomeAssistant) -> list[str]:

        if self.prefix_cache:
            return self.prefix_cache
        data = await self.data(hass)
        if not data:
            return []

        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        self.prefix_cache = []
        for prefix in config.data:
            if data.joinpath(prefix + ".json").is_file():
                self.prefix_cache.append(prefix)

        return self.prefix_cache

    async def list(self, hass: HomeAssistant, prefix: str) -> list[IconListItem]:

        datafile = await self.data(hass, prefix)

        if not datafile:
            return []

        return [{"name": k} for k in datafile.get("icons", {}).keys()]

    async def icon(
        self, hass: HomeAssistant, prefix: str, icon: str
    ) -> IconData | None:

        datafile = await self.data(hass, prefix)

        if not datafile or not datafile.get("icons", {}).get(icon, None):
            return None

        icon_data = {
            "renderer": "iconify",
            "left": datafile.get("left", 0),
            "top": datafile.get("top", 0),
            "width": datafile.get("width", 16),
            "height": datafile.get("height", 16),
            "rotate": datafile.get("rotate", 0),
            "vFlip": datafile.get("vFlip", False),
            "hFlip": datafile.get("hFlip", False),
        }
        icon_data.update(datafile.get("icons", {}).get(icon, {}))

        return icon_data

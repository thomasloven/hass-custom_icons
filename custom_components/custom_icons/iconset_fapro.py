import asyncio
import json
import random
import logging
from collections import defaultdict

from homeassistant.core import HomeAssistant

from .iconset_base import IconSetCollection, IconData, IconSetInfo, IconListItem

from .const import DOMAIN, ICON_PATH


LOGGER = logging.getLogger(__name__)

FONTAWESOME_FILENAME = "fontawesome.json"
PREPREFIX = "fapro-"


def get_data_file(hass: HomeAssistant) -> dict:
    filepath = hass.config.path(ICON_PATH + "/" + FONTAWESOME_FILENAME)
    try:
        with open(filepath) as fp:
            js = json.loads(fp.read())
        return js
    except FileNotFoundError:
        return None


class FontawesomeSets(IconSetCollection):

    def __init__(self):
        self.cache: dict[str, IconSetInfo] = {}
        self.list_cache = None

    def flush(self) -> None:
        self.cache = {}
        self.list_cache = None

    async def process_icons(self, hass: HomeAssistant):
        if self.list_cache:
            return self.list_cache

        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        loop = asyncio.get_running_loop()
        datafile = await loop.run_in_executor(None, get_data_file, hass)
        if not datafile:
            return

        self.list_cache = defaultdict(list)
        for k, v in datafile.items():
            for style in v.get("styles", []):
                self.list_cache[style].append(
                    {
                        "name": k,
                        "keywords": list(
                            map(str, v.get("search", {}).get("terms", []))
                        ),
                    }
                )
        return self.list_cache

    async def sets(self, hass: HomeAssistant) -> dict[str, IconSetInfo]:

        if self.cache:
            return self.cache

        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        data = await self.process_icons(hass)
        if not data:
            return {}

        for k, v in data.items():
            prefix = PREPREFIX + k

            samples = random.sample(v, 6)
            samples = [await self.icon(hass, prefix, icon["name"]) for icon in samples]

            self.cache[prefix] = {
                "name": f"Fontawesome {k}",
                "prefix": prefix,
                "total": len(v),
                "active": config.data.get(prefix, False),
                "sample_icons": samples,
            }

        return self.cache

    async def prefixes(self, hass: HomeAssistant) -> list[str]:
        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        return [p for p in config.data if p.startswith(PREPREFIX)]

    async def list(self, hass: HomeAssistant, prefix: str) -> list[IconListItem]:

        style = prefix.removeprefix(PREPREFIX)

        data = await self.process_icons(hass)

        if not data:
            return []

        return data[style]

    async def icon(
        self, hass: HomeAssistant, prefix: str, icon: str
    ) -> IconData | None:

        style = prefix.removeprefix(PREPREFIX)

        loop = asyncio.get_running_loop()
        datafile = await loop.run_in_executor(None, get_data_file, hass)

        if not datafile:
            return None

        svg = datafile.get(icon, {}).get("svg", {}).get(style)
        if not svg:
            return None

        path = svg.get("path")
        path2 = None
        if isinstance(path, list):
            path, path2 = path

        icon_data = {
            "renderer": None,
            "viewBox": svg.get("viewBox"),
            "path": path,
            "path2": path2,
            "body": svg.get("raw"),
        }

        return icon_data

import asyncio
import os
import logging
import random
from homeassistant.core import HomeAssistant

from .iconset_base import (
    IconSetCollection,
    IconData,
    IconSetInfo,
    IconListItem,
    process_svg,
)
from .const import DOMAIN, ICON_PATH

LOGGER = logging.getLogger(__name__)


def list_icons(root):
    icon_list = []
    for dirpath, dirnames, filenames in os.walk(root):
        subdir = dirpath.removeprefix(root).lstrip("/")
        icon_list.extend(
            [
                {"name": os.path.join(subdir, fn.removesuffix(".svg"))}
                for fn in filenames
                if fn.endswith(".svg") and not fn.endswith("-webfont.svg")
            ]
        )
    return icon_list


def read_icon(path: str) -> str:
    with open(path) as fp:
        return fp.read()


class LocalSet(IconSetCollection):

    def __init__(self):
        self.cache = []

    def flush(self) -> None:
        self.cache = []

    async def sets(self, hass: HomeAssistant) -> dict[str, IconSetInfo]:
        prefix = "local"
        icons = await self.list(hass, prefix)

        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        samples = random.sample(icons, min(6, len(icons)))
        samples = [await self.icon(hass, prefix, icon["name"]) for icon in samples]
        samples = [sample for sample in samples if sample is not None]

        return {
            prefix: {
                "name": "Local",
                "prefix": prefix,
                "total": len(icons),
                "active": config.data.get(prefix, False),
                "sample_icons": samples,
            }
        }

    async def prefixes(self, hass: HomeAssistant) -> list[str]:
        return ["local"]

    async def list(self, hass: HomeAssistant, prefix: str) -> list[IconListItem]:
        if self.cache:
            return self.cache

        icon_path = hass.config.path(ICON_PATH)

        loop = asyncio.get_running_loop()

        icons = await loop.run_in_executor(None, list_icons, icon_path)

        self.cache.extend(icons)

        return self.cache

    async def icon(
        self, hass: HomeAssistant, prefix: str, icon: str
    ) -> IconData | None:

        icon_path = hass.config.path(ICON_PATH + "/" + icon + ".svg")

        loop = asyncio.get_running_loop()
        icon_data = await loop.run_in_executor(None, read_icon, icon_path)

        try:
            return process_svg(icon_data)
        except Exception as err:
            # A single malformed SVG (e.g. from a Font Awesome Pro export)
            # used to crash the whole websocket call that lists icon sets,
            # leaving the config panel stuck on "Loading..." forever.
            # Skip just this icon instead.
            LOGGER.warning("Skipping unparseable local icon %r: %s", icon_path, err)
            return None

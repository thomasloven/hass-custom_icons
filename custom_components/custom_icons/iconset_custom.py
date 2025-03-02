import asyncio
import aiofiles
import os
import logging
from xml.dom import minidom
import random
from homeassistant.core import HomeAssistant

from .iconset_base import IconSetCollection, IconData, IconSetInfo, IconListItem
from .const import DOMAIN, ICON_PATH

LOGGER = logging.getLogger(__name__)


def list_icons(path):
    icon_list = []
    for dirpath, dirnames, filenames in os.walk(path):
        subdir = dirpath.removeprefix(path).lstrip("/")
        icon_list.extend(
            [
                {"name": os.path.join(subdir, fn.removesuffix(".svg"))}
                for fn in filenames
                if fn.endswith(".svg") and not fn.endswith("-webfont.svg")
            ]
        )
    return icon_list


class CustomSet(IconSetCollection):

    def __init__(self):
        self.cache = []

    def flush(self) -> None:
        self.cache = []

    async def sets(self, hass: HomeAssistant) -> dict[str, IconSetInfo]:
        prefix = "custom"
        icons = await self.list(hass, prefix)

        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        samples = random.sample(icons, min(6, len(icons)))
        samples = [await self.icon(hass, prefix, icon["name"]) for icon in samples]

        return {
            prefix: {
                "name": "Custom",
                "prefix": prefix,
                "total": len(icons),
                "active": prefix in config.data,
                "sample_icons": samples,
            }
        }

    async def prefixes(self, hass: HomeAssistant) -> list[str]:
        return ["custom"]

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

        icon_path = hass.config.path(ICON_PATH)
        icon_data = {}
        async with aiofiles.open(f"{icon_path}/{icon}.svg") as svg:
            body = await svg.read()
            if hasattr(body, "decode"):
                body.decode("utf-8")
            body = str(body)

            s = minidom.parseString(body)
            paths = s.getElementsByTagName("path")
            sumpath = ""
            path = ""
            path2 = ""

            for p in paths:
                d = p.getAttribute("d")
                sumpath += "d"
                classes = p.getAttribute("class").split()
                for c in classes:
                    if c in ["primary", "fa-primary"]:
                        path = d
                    if c in ["secondary", "fa-secondary"]:
                        patth2 = d

            path = path or sumpath

            viewBox = s.getElementsByTagName("svg")[0].getAttribute("viewBox").split()

            icon_data = {
                "renderer": None,
                "viewBox": viewBox,
                "path": path,
                "path2": path2,
                "body": body,
            }
        return icon_data

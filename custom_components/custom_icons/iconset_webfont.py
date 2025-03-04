import asyncio
import os
import logging
import random
from xml.dom import minidom
from homeassistant.core import HomeAssistant

from .iconset_base import (
    IconSetCollection,
    IconData,
    IconSetInfo,
    IconListItem,
)
from .const import DOMAIN, ICON_PATH

LOGGER = logging.getLogger(__name__)


def read_file(path: str) -> str:
    with open(path) as fp:
        return fp.read()


def list_files(root: str):
    set_list = []
    for dirpath, dirnames, filenames in os.walk(root):
        for f in filenames:
            if f.endswith("-webfont.svg"):
                set_list.append(os.path.join(dirpath, f))

    return set_list


def _process_icon(glyph, size):
    path = glyph.getAttribute("d")
    return {
        "renderer": None,
        "viewBox": [0, 0, size, size],
        "path": path,
        "body": f"""
            <g transform='translate(0, {size}) scale(1, -1)'>
                <path d='{path}' />
            </g>""",
    }


class WebfontSets(IconSetCollection):

    def __init__(self):
        self.cache = {}

    def flush(self) -> None:
        self.cache = {}

    async def sets(self, hass: HomeAssistant) -> dict[str, IconSetInfo]:

        if self.cache:
            return self.cache

        config = hass.config_entries.async_entries(DOMAIN)
        config = config[0] if config else {}

        icon_path = hass.config.path(ICON_PATH)

        loop = asyncio.get_running_loop()
        fonts = await loop.run_in_executor(None, list_files, icon_path)

        for f in fonts:
            data = await loop.run_in_executor(None, read_file, f)
            if hasattr(data, "decode"):
                data.decode("utf-8")
            s = minidom.parseString(str(data))
            for font in s.getElementsByTagName("font"):
                prefix = font.getAttribute("id")
                glyphs = font.getElementsByTagName("glyph")
                size = (
                    int(font.getAttribute("horiz-adv-x"))
                    if font.hasAttribute("horiz-adv-x")
                    else 1000
                )

                samples = random.sample(glyphs, min(6, len(glyphs)))
                samples = [_process_icon(icon, size) for icon in samples]

                self.cache[prefix] = {
                    "name": prefix,
                    "prefix": prefix,
                    "total": len(glyphs),
                    "active": config.data.get(prefix, False),
                    "sample_icons": samples,
                    "filename": f,
                    "size": size,
                }

        return self.cache

    async def prefixes(self, hass: HomeAssistant) -> list[str]:
        sets = await self.sets(hass)

        return list(sets.keys())

    async def list(self, hass: HomeAssistant, prefix: str) -> list[IconListItem]:

        sets = await self.sets(hass)

        loop = asyncio.get_running_loop()
        data = await loop.run_in_executor(None, read_file, sets[prefix]["filename"])
        s = minidom.parseString(str(data))

        return [
            {"name": g.getAttribute("glyph-name")}
            for g in s.getElementsByTagName("glyph")
        ]

    async def icon(
        self, hass: HomeAssistant, prefix: str, icon: str
    ) -> IconData | None:

        sets = await self.sets(hass)

        loop = asyncio.get_running_loop()
        data = await loop.run_in_executor(None, read_file, sets[prefix]["filename"])
        s = minidom.parseString(str(data))

        for g in s.getElementsByTagName("glyph"):
            if g.getAttribute("glyph-name") == icon:
                return _process_icon(g, sets[prefix]["size"])

        return None

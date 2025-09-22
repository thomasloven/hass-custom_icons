from typing import TypedDict
from xml.dom import minidom
from homeassistant.core import HomeAssistant


class IconData(TypedDict):
    renderer: str | None


class IconSetInfo(TypedDict):
    name: str
    prefix: str
    total: int
    active: bool
    sample_icons: list[IconData]


class IconListItem(TypedDict):
    name: str
    keywords: list[str]


class IconSetCollection:

    def flush(self) -> None:
        pass

    async def sets(self, hass: HomeAssistant) -> dict[str, IconSetInfo]:
        return {}

    async def prefixes(self, hass: HomeAssistant) -> list[str]:
        return []

    async def list(self, hass: HomeAssistant, prefix: str) -> list[IconListItem]:
        return []

    async def icon(
        self, hass: HomeAssistant, prefix: str, icon: str
    ) -> IconData | None:
        pass


def process_svg(svg) -> IconData:

    body = svg

    if hasattr(body, "decode"):
        body.decode("utf-8")
    body = str(body)

    s = minidom.parseString(body)
    sumpath = ""
    path = ""
    path2 = ""

    for p in s.getElementsByTagName("path"):
        d = p.getAttribute("d")
        sumpath += d
        classes = p.getAttribute("class").split()
        for c in classes:
            if c in ["primary", "fa-primary"]:
                path = d
            if c in ["secondary", "fa-secondary"]:
                path2 = d

    path = path or sumpath

    body = "".join(
        (n.toprettyxml() for n in s.getElementsByTagName("svg")[0].childNodes)
    )

    body = "<defs><style>.fa-secondary{opacity:.4}</style></defs>" + body

    viewBox = s.getElementsByTagName("svg")[0].getAttribute("viewBox").split()

    icon_data = {
        "renderer": None,
        "viewBox": viewBox,
        "path": path,
        "path2": path2,
        "body": body,
    }

    return icon_data

from typing import TypedDict
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

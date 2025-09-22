import logging
from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from .const import DOMAIN


LOGGER = logging.getLogger(__name__)


class CustomIconsConfigFlow(ConfigFlow, domain=DOMAIN):

    VERSION = 1

    def __init__(self) -> None:
        self.download_task = None
        self.icon_sets = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self.async_create_entry(
            title="Custom Icons",
            data={
                "local": True,
                "fa6-regular": True,
                "fa6-solid": True,
                "fa6-brands": True,
            },
        )

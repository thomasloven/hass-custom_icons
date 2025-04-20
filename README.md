![example image](https://github.com/user-attachments/assets/de32cf37-4564-420e-b6c8-917cc97aa108)

## Installation

- ~~Install Custom Icons through HACS [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thomasloven&repository=hass-custom_icons)~~
- This is not on HACS yet, but you can add it as a Custom Repository. Make sure to select "Type: Integration".
  - Or copy the contents of `custom_components/custom_icons/` to `<config>/custom_components/custom_icons`
- Restart Home Assistant
- Click this [![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=custom_icons)
  - Alternatively, go to your integrations configuration, click "Add Integration" and find "Custom Icons"

## Usage

- Go to your integrations configuration, click "Custom Icons" and then "CONFIGURE".

![configuration](https://github.com/user-attachments/assets/3e88a032-0fb1-4975-95e6-07a809cd2239)

- Here, in the Configuration Panel, you can pick which icon sets you want to use.

![select sets](https://github.com/user-attachments/assets/84c3289c-ec4b-40c8-b54d-be4f2f1dd89d)

- After enabling icon sets and refreshing your browser (F5) you will be able to find your icons in the icon picker.

![icon picker](https://github.com/user-attachments/assets/fb17667e-8161-48a8-adc9-78893961dd05)

## Icon sets

### Your own icons

To use your own icons, place their .svg files in `<config>/custom_icons` (the directory should have been created by Custom Icons automatically).
You can also place icons in subdirectories.

If you add new icons, you need to push the RELOAD button before they can be used.

> **Note about safety:**
>
> SVG files may contain SVG and Javascript and shall be considered unsafe.
> Home Assistant normally protects you from harmful code in SVG icons, but in order to make e.g. full color or animated icons work this protection has been removed by Custom Icons.
>
> Only use icons you trust (and preferably have inspected the code for). The author of Custom Icons takes no responsibility for the contents of any icon set - not even those included in Iconify.

### Iconify

[Iconify](https://iconify.design/) is a framework for several popular icon sets.

The icon sets are update frequently, so you can manually download the lates updates from the Custom Icons configuration panel.

You also need to download them by clicking the button manually the first time.

### Fontawesome Pro icons

If you bought the fontawesome package, you should have received the icon set as a zip file or something.

Somewhere in this file, there's a folder named `metadata` which contains a file `icons.json`.

Copy and rename this file to `<config>/custom_icons/fontawesome.json`.

Push the RELOAD button in the Custom Icons configuration panel.

### Webfonts

There is some support for svg webfonts like [RPG Awesome](https://github.com/nagoshiashumari/Rpg-Awesome/).

To use those, get the `<whatever>-webfont.svg` file and copy that to `<config>/custom_icons/`.

Push the RELOAD button in the Custom Icons configuration panel.

Note that SVG webfonts has been deprecated and removed from the SVG standard. Things may or may not work.

## FAQ

### Does this replace `hass-fontawesome`?

Yes

### Do I need all that `#fullcolor` nonsense from `hass-fontawesome`?

No

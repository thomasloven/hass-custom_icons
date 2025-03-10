import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { renderIconHTML } from "../helpers";

@customElement("custom-icons-icon")
class CustomIconsIcon extends LitElement {
  @property() icon;

  render() {
    return unsafeHTML(renderIconHTML(this.icon));
  }
}

@customElement("custom-icons-select-set-card")
export class CustomIconsSelectSetCard extends LitElement {
  @property() hass;
  @property() sets;

  async _toggle_set(prefix) {
    const state = this.sets[prefix].active;
    await this.hass.connection.sendMessage({
      type: "custom_icons/select",
      set: prefix,
      active: !state,
    });
  }

  render() {
    return html`
      <ha-card outlined>
        <h1 class="card-header">Icon sets</h1>
        <div class="card-content">
          <p>Only enabled icon sets will be available.</p>
          <p>Remember to refresh your browser after enabling new icon sets.</p>

          ${Object.keys(this.sets).map((prefix) => {
            const set = this.sets[prefix];
            return html`
              <ha-settings-row>
                <span slot="heading">
                  ${set.name} (<span
                    class="prefix ${set.active ? "active" : ""}"
                    >${prefix}:</span
                  >)
                </span>
                <span slot="description">
                  <div>
                    ${set.total} icons
                    ${set.author
                      ? html`by ${set.author.name} -
                          <a href="${set.author.url}" target="_blank">
                            ${set.author.url}
                          </a>`
                      : ""}
                  </div>
                  ${set.sample_icons
                    ? html` <div class="samples">
                        ${set.sample_icons?.map((i) => {
                          return html`<custom-icons-icon
                            .icon=${i}
                          ></custom-icons-icon>`;
                        })}
                        ${set.sample_icons?.[0]?.renderer == "iconify"
                          ? html`
                              <a
                                href="https://icon-sets.iconify.design/${prefix}/"
                                target="_blank"
                              >
                                <ha-icon .icon=${"mdi:open-in-new"}> </ha-icon>
                              </a>
                            `
                          : ""}
                      </div>`
                    : ""}
                </span>

                <ha-switch
                  .checked=${set.active}
                  @change=${() => this._toggle_set(prefix)}
                >
                </ha-switch>
              </ha-settings-row>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      .card-header {
        display: flex;
        justify-content: space-between;
      }
      a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .prefix {
        font-family: monospace;
      }
      .prefix.active {
        color: var(--primary-color);
      }
      ha-icon-button > * {
        display: flex;
        color: var(--primary-text-color);
      }
      .samples * {
        vertical-align: bottom;
      }
      custom-icons-icon {
        fill: currentColor;
        font-size: 2.5em;
        vertical-align: top;
        margin-right: 4px;
        transition: font-size 0.2s;
      }
      custom-icons-icon:hover {
        color: var(--accent-color);
      }
    `;
  }
}

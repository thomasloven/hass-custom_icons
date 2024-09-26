import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loadConfigDashboard } from "../helpers.js";

import "./download-card";
import "./select-set-card";

loadConfigDashboard();

@customElement("iconify-panel")
class BrowserModPanel extends LitElement {
  @property() hass;
  @property() narrow;
  @property() connection;

  @property() sets;

  async _get_sets() {
    this.sets = await this.hass.connection.sendMessagePromise({
      type: "iconify/sets",
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._get_sets();
  }

  protected render() {
    return html`
      <ha-top-app-bar-fixed>
        <ha-menu-button
          slot="navigationIcon"
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div slot="title">Iconify Settings</div>

        <ha-config-section .narrow=${this.narrow} full-width>
          <iconify-download-card .hass=${this.hass}> </iconify-download-card>
          ${this.sets
            ? html`
                <iconify-select-set-card
                  .hass=${this.hass}
                  .sets=${this.sets}
                ></iconify-select-set-card>
              `
            : ""}
        </ha-config-section>
      </ha-top-app-bar-fixed>
    `;
  }

  static get styles() {
    return [
      ...((customElements.get("ha-config-dashboard") as any)?.styles ?? []),
      css`
        :host {
          --app-header-background-color: var(--sidebar-background-color);
          --app-header-text-color: var(--sidebar-text-color);
          --app-header-border-bottom: 1px solid var(--divider-color);
          --ha-card-border-radius: var(--ha-config-card-border-radius, 8px);
        }
        ha-config-section {
          padding: 16px 0;
          direction: ltr;
        }
        a {
          color: var(--primary-text-color);
          text-decoration: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
        }
        ha-textfield {
          width: 250px;
          display: block;
          margin-top: 8px;
        }
      `,
    ];
  }
}

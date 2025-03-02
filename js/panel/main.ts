import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loadConfigDashboard } from "../helpers.js";

import "./download-card";
import "./select-set-card";

loadConfigDashboard();

@customElement("custom-icons-panel")
class BrowserModPanel extends LitElement {
  @property() hass;
  @property() narrow;
  @property() connection;

  @property() sets;

  async _get_sets() {
    this.sets = null;
    this.requestUpdate();
    this.sets = await this.hass.connection.sendMessagePromise({
      type: "custom_icons/sets",
    });
  }

  _clear() {
    this.sets = null;
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
        <div slot="title">Custom Icon Settings</div>

        <ha-config-section .narrow=${this.narrow} full-width>
          <custom-icons-download-card
            .hass=${this.hass}
            @reload=${() => this._get_sets()}
            @clear=${() => this._clear()}
          >
          </custom-icons-download-card>
          ${this.sets
            ? html`
                <custom-icons-select-set-card
                  .hass=${this.hass}
                  .sets=${this.sets}
                ></custom-icons-select-set-card>
              `
            : html`<ha-card outlined
                ><div class="card-content"><p>Loading...</p></div></ha-card
              >`}
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

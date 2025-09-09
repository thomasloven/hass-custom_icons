import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("custom-icons-download-card")
export class CustomIconsDownloadCard extends LitElement {
  @property() hass;

  @query("#download-button") download_button;

  async _download_iconify() {
    this.dispatchEvent(new Event("clear"));
    this.download_button.disabled = true;
    await this.hass.connection.sendMessagePromise({
      type: "custom_icons/iconify_download",
    });
    this.dispatchEvent(new Event("reload"));
    this.download_button.disabled = false;
  }

  async _flush_icons() {
    await this.hass.connection.sendMessage({
      type: "custom_icons/flush_icons",
    });
    this.dispatchEvent(new Event("reload"));
  }

  render() {
    return html`
      <ha-card outlined>
        <h1 class="card-header">Custom icons</h1>
        <div class="card-content">
          <ha-alert alert-type="warning" title="Dangers of external SVG icons">
            SVG icons cat theoretically contain javascript and listeners or link
            to external resources. <br />

            Home Assistant normally protects against this, but in order to
            enable advanced features such as duotone or color support
            <b>that protection is disabled for all Custom Icons</b>. <br />

            Iconify icons are allegedly validated and cleaned from any such
            potentially harmful elements, but be careful. <br />
            <br />

            I as the author of this Home Assistant component take no
            responsibility for the content of the icon sets.
          </ha-alert>

          <br />
          <ha-settings-row>
            <span slot="heading">Reload Local Icons</span>
            <span slot="description">
              Reload icons in the
              <tt>custom_icons</tt>
              directory<br />
              (this includes Fontawesome-pro icons if available)
            </span>
            <ha-button @click=${() => this._flush_icons()}>Reload</ha-button>
          </ha-settings-row>
          <br />

          <ha-alert alert-type="info" title="About Iconify icons">
            <a href="https://iconify.design/">Iconify</a> is a collection of
            several popular icon sets. Updates are published frequently, and the
            database is therefore downloaded from github on request. If an icon
            seems to be missing, try the Download button below to update the
            local database.
          </ha-alert>

          <ha-settings-row>
            <span slot="heading">Update Iconify Icons</span>
            <span slot="description">
              Download the latest icon sets from
              <a href="https://github.com/iconify/icon-sets">github</a>
            </span>
            <ha-button
              id="download-button"
              @click=${() => this._download_iconify()}
              >Download</ha-button
            >
          </ha-settings-row>
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
      ha-textfield {
        width: 250px;
        display: block;
        margin-top: 8px;
      }
      a {
        color: var(--primary-color);
        text-decoration: none;
      }
    `;
  }
}

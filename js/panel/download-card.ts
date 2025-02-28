import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("iconify-download-card")
export class IconifyDownloadCard extends LitElement {
  @property() hass;

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
            <b>that protection is disabled for all Iconify icon</b>. <br />

            Iconify icons are allegedly validated and cleaned from any such
            potentially harmful elements, but be careful. <br />
            <br />

            I as the author of this Home Assistant component take no
            responsibility for the content of the icon sets.
          </ha-alert>

          <br />
          <br />

          <ha-alert alert-type="info" title="About Iconify icons">
            <a href="https://iconify.design/">Iconify</a> is a collection of
            several popular icon sets. Updates are published frequently, and the
            database is therefore downloaded from github on request. If an icon
            seems to be missing, try the Download button below to update the
            local database.
          </ha-alert>

          <ha-settings-row>
            <span slot="heading">Update Iconify icons</span>
            <span slot="description">
              Download the latest icon sets from
              <a href="https://github.com/iconify/icon-sets">github</a>
            </span>
            <ha-button>Download</ha-button>
          </ha-settings-row>

          <ha-settings-row>
            <span slot="heading">Reload custom icons</span>
            <span slot="description">
              Reload icons in the
              <tt>custom_icons</tt>
              directory
            </span>
            <ha-button>Reload</ha-button>
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

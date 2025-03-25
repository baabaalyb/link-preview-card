import { LitElement, html, css } from "lit";

export class LinkPreviewCard extends LitElement {
  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.href = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.themeColor = "";
    this.loadingState = false;
  }

  static get properties() {
    return {
      title: { type: String },
      href: { type: String },
      description: { type: String },
      image: { type: String },
      link: { type: String },
      themeColor: { type: String },
      loadingState: { type: Boolean, reflect: true, attribute: "loading-state" },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 16px;
        max-width: 400px;
      }

      .preview {
        display: flex;
        flex-direction: column;
        text-align: center;
      }

      img {
        display: block;
        max-width: 80%;
        height: auto;
        margin: 8px auto;
        border-radius: 4px;
      }

      .content {
        margin-top: 12px;
        padding: 0 8px;
      }

      .title {
        font-weight: bold;
        font-size: 18px;
        margin: 12px 0;
        color: var(--themeColor, #333);
      }

      details {
        border: 1px solid var(--themeColor, #ccc);
        border-radius: 4px;
        text-align: center;
        padding: 8px;
        height: 70px;
      }

      details summary {
        text-align: center;
        font-size: 12px;
        padding: 8px 0;
      }

      .desc {
        font-size: 12px;
        color: #666;
        margin: 8px 0;
      }

      .url {
        display: inline-block;
        padding: 8px 12px;
        margin: 8px auto;
        font-weight: bold;
        color: white;
        border-radius: 4px;
        transition: background-color 0.3s ease-in-out;
        text-decoration: none;
      }

      .loading-spinner {
        margin: 20px auto;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 600px) {
        :host {
          max-width: 100%;
          padding: 12px;
        }
      }
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(link) {
    this.loadingState = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }

      const json = await response.json();

      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.description = json.data["description"] || "No Description Available";
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.link = json.data["url"] || link;
      this.themeColor = this.defaultTheme();
      
      
      if (this.href.includes("reddit.com")) {
        this.description = "A social news aggregation and discussion website.";
      } else if (this.href.includes("amazon.com")) {
        this.description = "An online shopping platform for a variety of goods.";
      }
      
    } catch (error) {
      console.error("Error fetching metadata:", error);
    
      if (this.href.includes("reddit.com")) {
        this.title = "Reddit";
        this.description = "A social news aggregation and discussion website.";
        this.image = "https://www.redditstatic.com/desktop2x/img/favicon/png/reddit-icon.png"; // Default Reddit image
      } else if (this.href.includes("amazon.com")) {
        this.title = "Amazon";
        this.description = "An online shopping platform for a variety of goods.";
        this.image = "https://icons.iconarchive.com/icons/danleech/simple/512/Amazon-icon.png"; // Default Amazon image
      } else {
        this.title = "No Preview Available";
        this.description = "No Description Available";
        this.image = "";
        this.link = "";
      }
      this.themeColor = this.defaultTheme();
    } finally {
      this.loadingState = false;
    }
  }

  defaultTheme() {
    if (this.href.includes("psu.edu")) {
      return "navy";
    } else if (this.href.includes("youtube.com")) {
      return "red";
    } else if (this.href.includes("reddit.com")) {
      return "orange";
    } else if (this.href.includes("amazon.com")) {
      return "blue";
    } else {
      return "#333";
    }
  }

  handleImageError() {
    console.warn("Image failed to load:", this.image);
    this.image = "";
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="preview" style="--themeColor: ${this.themeColor}">
        ${this.loadingState
          ? html`<div class="loading-spinner"></div>`
          : html`
              ${this.image ? html`<img src="${this.image}" alt="" @error="${this.handleImageError}" />` : ''}
              <div class="content">
                <h3 class="title">${this.title}</h3>
                <details>
                  <summary>Description</summary>
                  <p class="desc">${this.description}</p>
                </details>
                ${this.link ? html`<a href="${this.link}" target="_blank" class="url" style="background-color: ${this.themeColor};">Visit Site</a>` : ''}
              </div>
            `}
      </div>
    `;
  }
}

customElements.define(LinkPreviewCard.tag, LinkPreviewCard);

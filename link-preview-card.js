class LinkPreviewCard extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.href = this.getAttribute('href');
      this.shadowRoot.innerHTML = `
          <style>
              .card {
                  border: 1px solid #ccc;
                  padding: 10px;
                  margin-top: 10px;
              }
              .loading {
                  text-align: center;
              }
          </style>
          <div class="loading">Loading...</div>
          <div class="card"></div>
      `;
      this.fetchData();
  }

  async fetchData() {
      if (!this.href) return;

      try {
          const response = await fetch(`https://open-apis.haxtheweb.org/api/website/metadata?url=${encodeURIComponent(this.href)}`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          this.renderCard(data.data);
      } catch (error) {
          console.error('Error fetching data:', error);
          this.shadowRoot.querySelector('.loading').textContent = 'No preview available.';
      }
  }

  renderCard(data) {
      this.shadowRoot.querySelector('.loading').style.display = 'none';
      const card = this.shadowRoot.querySelector('.card');
      card.innerHTML = `
          <h3>${data.title || 'No Title'}</h3>
          <p>${data.description || 'No description'}</p>
          <a href="${data.url}">${data.url}</a>
      `;
  }
}

customElements.define('link-preview-card', LinkPreviewCard);

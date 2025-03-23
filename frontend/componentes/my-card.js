import { LitElement, html, css } from 'lit';

export class MyCard extends LitElement {
  static properties = {
    tipo: { type: String },
    numero: { type: String },
  };

  static styles = css`
    .tarjeta {
      background-color: #f5f5f5;
      padding: 1rem;
      margin: 1rem;
      border-radius: 0.6rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `;

  render() {
    return html`
      <div class="tarjeta">
        <h3>${this.tipo}</h3>
        <p>${this.numero}</p>
      </div>
    `;
  }
}

customElements.define('my-card', MyCard);
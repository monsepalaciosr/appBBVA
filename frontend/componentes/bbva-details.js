import { LitElement, html, css } from "lit";

export class BbvaDetails extends LitElement {
    constructor() {
        super();
        this.tarjeta = null;
        }
    
    static properties = {
        tarjeta: {type: Object}
    };

    static styles = css`
        :host {
            display: block;   
            width: 100%;
            height: 100%;
            background-color: var(--principalBlue);
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            min-height: 100vh; 
            color: var(--white);
            padding: 1rem 3rem;
            box-sizing: border-box; 
        }

        .detail {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--white);
            width: 100%;
            min-height: 100vh;
            padding: 5rem;
            box-sizing: border-box;
            color: var(--black); 
        }

        .icons {
            text-align: right;
        }

        .icon {
            padding: 1rem 2rem;
            cursor: pointer;
        }
    `;

    async connectedCallback() {
        super.connectedCallback();
        const tarjetaSeleccionada = JSON.parse(localStorage.getItem('tarjetaSeleccionada'));
        if(tarjetaSeleccionada) {
            this.tarjeta = tarjetaSeleccionada;
        } else {
            console.log('No se encontró la tarjeta seleccionada');
        }
        this.requestUpdate();
    }

    regresar() {
        const event = new CustomEvent('regresar', {
            detail: { message: 'Regresando a la vista anterior' },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <section class="icons">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16" @click="${this.regresar}">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                </svg>
            </section>
            <section class="container">
                <h2> Información de tu tarjeta: </h2>
                <section class="detail">
                    <h3>Tarjeta: ${this.tarjeta.tipo}</h3> <br>
                    <p> Número: ${this.tarjeta.numero} </p>
                </section>
            </section>
        `;
    }
}

customElements.define('bbva-details', BbvaDetails);

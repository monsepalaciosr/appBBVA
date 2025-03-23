import { LitElement, html, css } from "lit";

export class InfoUser extends LitElement {
    constructor() {
        super();
    }

    static properties = {
        userId: { type: Number}
    };

    static styles = css`
        :host {
            display: block;   
            width: 100%;
            height: 100%;
        }

        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: var(--principalBlue);
            width: 100%;
            min-height: 100vh; 
            color: var(--white);
            padding: 2rem;
            box-sizing: border-box; 
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        const userId = this.localStorage.getItem('userId');
        this.userId = userId;
        this.mostrarTarjeta(userId);
    }

    mostrarTarjeta() {
        fetch(`http://localhost:3000/tarjetas?userId=${userId}`)
            .then(response => response.json())
            .then(tarjetas =>{
                // this.renderTarjetas(tarjetas)
                console.log(tarjetas);
            })
            .catch(error => console.error(error));
    }

    masInfo() {

    }

    salir() {

    }

    render() {
        return html`
            <section class="container">
                <h1>Seccion tarjetas</h1>
            </section>
        `;
    }
}

customElements.define('info-user', InfoUser);
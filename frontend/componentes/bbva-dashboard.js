import { LitElement, html, css } from "lit";
import './spinner.js'; // Importa el componente del spinner

export class BbvaDashboard extends LitElement {
    constructor() {
        super();
        this.userId = null;
        this.userName = '';
        this.tarjetas = [];
        this.tarjetaSeleccionada = null;
        this.mostrarDetalles = false;
        this.cargando = false; 
    }

    static properties = {
        userId: { type: Number },
        userName: { type: String },
        tarjetas: { type: Array },
        cargando: { type: Boolean } 
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
            align-items: center;
            background-color: var(--principalBlue);
            width: 100%;
            min-height: 100vh;
            color: var(--white);
            padding: 2rem;
            box-sizing: border-box;
        }

        .tarjeta {
            height: 10rem;
            width: 40rem;
            background-color: var(--white);
            padding: 1rem;
            margin: 1rem;
            border-radius: 0.6rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            color: var(--black);
        }

        .card-icon {
            height: 7rem;
            width: 7rem;
        }

        .data {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .label, .balance {
            font-size: 1.2rem;
        }

        .tarjeta:hover {
            background-color: var(--lightGray);
            cursor: pointer;
        }
    `;

    async connectedCallback() {
        super.connectedCallback();
        const userId = localStorage.getItem('userId');
        this.userId = userId;
        const tarjetaGuardada = localStorage.getItem('tarjetaSeleccionada');
        const mostrarDetalles = localStorage.getItem('mostrarDetalles');

        if (tarjetaGuardada && mostrarDetalles === 'true') {
            this.tarjetaSeleccionada = JSON.parse(tarjetaGuardada);
            this.mostrarDetalles = true;
        }
        await this.obtenerInfoUsuario(userId);
        await this.mostrarTarjeta(userId);
    }

    async obtenerInfoUsuario(userId) {
        try {
            const response = await fetch('http://localhost:3000/users');
            const usuarios = await response.json();
            const usuario = usuarios.find(user => user.userId == userId);
            if (usuario) {
                this.userName = usuario.nombre;
                this.requestUpdate();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async mostrarTarjeta(userId) {
        try {
            const response = await fetch(`http://localhost:3000/tarjetas?userId=${userId}`);
            const tarjetas = await response.json();
            this.tarjetas = tarjetas;
            console.log(tarjetas);
            this.requestUpdate();
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerDetallesTarjeta(tarjeta) {
        this.cargando = true; 
        this.requestUpdate();

        
        await new Promise(resolve => setTimeout(resolve, 3000));

        this.tarjetaSeleccionada = tarjeta;
        this.mostrarDetalles = true;
        this.cargando = false; 
        localStorage.setItem('tarjetaSeleccionada', JSON.stringify(tarjeta));
        localStorage.setItem('mostrarDetalles', 'true');

        this.requestUpdate();
        await this.updateComplete;
    }

     async regresar() {
        this.cargando = true; 
        this.requestUpdate();

        await new Promise(resolve => setTimeout(resolve, 3000));
        this.mostrarDetalles = false;
        this.tarjetaSeleccionada = null;
        this.cargando = false;
        localStorage.removeItem('tarjetaSeleccionada');
        localStorage.removeItem('mostrarDetalles');
        this.requestUpdate();
    }

    escuchaElRegreso() {
        this.mostrarDetalles = false;
        this.tarjetaSeleccionada = null;
        this.requestUpdate();
    }

    salir() {
        localStorage.removeItem('userId');
        localStorage.removeItem('tarjetaSeleccionada');
        localStorage.removeItem('mostrarDetalles');

        const event = new CustomEvent('salir', {
            detail: { message: 'Cerrando sesión' },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
        window.location.reload();
    }

    render() {
        if (this.cargando) {
            return html`<bbva-spinner></bbva-spinner>`; 
        }

        if (this.mostrarDetalles && this.tarjetaSeleccionada) {
            return html`
                <bbva-details 
                    .tarjeta=${this.tarjetaSeleccionada}
                    @regresar="${this.regresar}">
                </bbva-details>
            `;
        }

        return html`
            <section class="icons">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-x-circle-fill" viewBox="0 0 16 16" @click="${this.salir}">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                </svg>
            </section>
            <section class="container">
                <h2>Hola, ${this.userName}</h2>
                <div class="tarjetas">
                    <h3>Tarjetas</h3>
                    ${this.tarjetas.map((tarjeta => html`
                        <section class="tarjeta" @click="${() => this.obtenerDetallesTarjeta(tarjeta)}"> 
                            <p> Tarjeta: ${tarjeta.tipo}</p>
                            <section class=data> 
                                <img class="card-icon" src="./img/card-icon.png">
                                <p> Número: ${tarjeta.numero} </p>
                                <div>
                                    <p class="balance">${tarjeta.saldo.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                                    <p class="label">Saldo total</p>
                                </div>
                            </section>
                        </section>
                    `))}
                </div>
            </section>
        `;
    }
}

customElements.define('bbva-dashboard', BbvaDashboard);
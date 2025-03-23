import { LitElement, html, css } from "lit";

export class InfoUser extends LitElement {
    constructor() {
        super();
        this.userId = null;
        this.userName = '';
        this.tarjetas = [];
    }

    static properties = {
        userId: { type: Number},
        userName: {type: String},
        tarjetas: {type: Array}
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
            background-color: var(--white);
            padding: 1rem;
            margin: 1rem;
            border-radius: 0.6rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            color: var(--black);
        }
    `;

    async connectedCallback() {
        super.connectedCallback();
        const userId = localStorage.getItem('userId');
        this.userId = userId;
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

    masInfo() {

    }

    regresar() {

    }

    render() {
        return html`
            <section class="container">
                <h2>Hola, ${this.userName}</h2>
                    <div class="tarjetas">
                        <h3>Tarjetas</h3>
                        ${this.tarjetas.map((tarjeta => html`
                            <section class="tarjeta"> 
                                <p> Tarjeta: ${tarjeta.tipo}</p> 
                                <p> Número: ${tarjeta.numero} </p>
                            </section>
                            `))}
                    </div>
            </section>
        `;
    }
}

customElements.define('info-user', InfoUser);
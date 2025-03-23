import { LitElement, html, css } from 'lit';
import './spinner.js'; 

export class Login extends LitElement {
    constructor() {
        super();
        this.user = '';
        this.pass = '';
        this.tarjetaSeleccionada = null;
        this.mostrarDetalles = false;
        this.cargando = false; 
    }

    static properties = {
        user: { type: String },
        pass: { type: String },
        cargando: { type: Boolean } 
    };

    static styles = css`
        :host {
            display: block;   
            width: 100%;
            height: 100%;
        }

        .container-login {
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
            gap:10rem;
        }

        .logo{
            height: 7rem;
        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 3rem;
            width: 100%;
            max-width: 40rem;  
        }

        input{
             height: 5rem;
             border:none;
             border-bottom: 1px solid var(--white);
             background-color: var(--inputBlue);
             color: var(--white);
             padding: 0 1rem;
             outline: none;             
        }

        button{
            padding: 2rem;
            background-color: var(--white);
            color: var(--principalBlue);
            border: none;
        }

        button:hover{
            background-color: var( --lightGray);
            cursor: pointer;
        }

        .mensajeError {
            background-color: var(--red);
            padding: 1rem;
            border-radius: 0.6rem;
        }
    `;

    enviarFormulario(event) {
        event.preventDefault();
        if (!this.cargando) {
            this.successLogin();
        }
    }

    infoInput(event) {
        const {name, value} = event.target;
        this[name] = value;
    }

    mensajeError() {
        const contenedor = this.shadowRoot.querySelector('.container');
        const mensaje = document.createElement('p');
        mensaje.textContent = 'Usuario o contraseña incorrectos, favor de verificar';
        mensaje.classList.add('mensajeError');
        contenedor.appendChild(mensaje);
        setTimeout(() => {
            mensaje.remove();
        }, 3000); 
    }

    successLogin() {
        this.cargando = true; 
        this.requestUpdate();

        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(usuarios => {
                const usuarioEncontrado = usuarios.find(usuario => usuario.user === this.user && usuario.pass === this.pass);

                if (usuarioEncontrado) {
                    console.log('Ha iniciado sesión exitosamente');
                    localStorage.setItem('userId', usuarioEncontrado.userId);
                    this.mostrarInfoUser();
                } else {
                    this.mensajeError();
                }
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.cargando = false; 
                this.requestUpdate();
            });
    }

    mostrarInfoUser() {
        const infoUserElement = document.createElement('info-user');
        const mainContainer = document.querySelector('main');
        mainContainer.innerHTML = '';
        mainContainer.appendChild(infoUserElement);
    }

    escucharSalir() {
        localStorage.removeItem('userId');
        window.location.reload();  
    }

    render() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            return html`
                <info-user @salir="${this.salir}"></info-user>
            `;
        }

        if (this.cargando) {
            return html`<bbva-spinner></bbva-spinner>`;
        }

        return html`
            <section class="container-login" @submit="${this.enviarFormulario}">
                <img class="logo" src="./img/bbva-logo.png">
                <form class="form">
                    <input type="text" name="user" .value="${this.user}" @input="${this.infoInput}" placeholder="Usuario" required>
                    <input type="password" name="pass" .value="${this.pass}" @input="${this.infoInput}" placeholder="Contaseña" required>
                    <button type="submit"> Ingresar </button>
                </form>
            </section>
        `;
    }
}

customElements.define('my-login', Login);
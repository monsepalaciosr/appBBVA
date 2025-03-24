 
import { LitElement, html, css } from 'lit';

export class BbvaSpinner extends LitElement {
    static styles = css`
    .main{
        height: 100vh;
        background-color:var(--principalBlue);
        display: flex;
        justify-content:center;
        align-items:center;
    }

    .load-container{
        background-color:white;
        border-radius: 10rem;
    }
    .loader{
        height: 20rem;
        width: 20rem;
    }
    `

    render() {
        return html`
        <section class=main>
        <section class = "load-container">
        <img class ="loader" src="./img/load-bbva.gif">
        </section>
        </section>
       
            `;
    }
}

customElements.define('bbva-spinner', BbvaSpinner);
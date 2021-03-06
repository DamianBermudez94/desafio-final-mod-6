import { state } from "../../state";
import { Router } from "@vaadin/router";
const imgFondo = require("url:../../../client/img/fondopage.png");

customElements.define(
  "game-page",
  class extends HTMLElement {
    myPlay: string = "";
    otherPlay: string;
    connectedCallback() {
      this.render();

      const handsElement =
        this.querySelector(".container-hand").querySelectorAll(
          "hand-component"
        );

      //Dependiendo de que mano elija, seteo el movimiento
      handsElement.forEach((hand) => {
        hand.addEventListener("click", (e: any) => {
          this.myPlay = e.target.name;
          state.setMove(this.myPlay);
        });
      });

      //Luego de los segundos para elegir me fijo si los dos jugadores seleccionaron una jugada
      //Si alguno no selecciona redireccion a pagina /instructions sino se muestran las jugadas
      
      setTimeout(() => {
        const cs = state.getState();
        this.otherPlay = cs.otherMove;
        if (this.otherPlay == "" || this.myPlay == "") {
          state.reset();
          Router.go("/instructions");
        } else {
          this.hands();
        }
      }, 3600);
    }
    hands() {
      this.innerHTML = ``;
      const style = document.createElement("style");
      style.innerHTML = `
        *{
          overflow-x:hidden;
          overflow-y:hidden;
         
        }
       .container-myplay{
          margin: 0 auto;
          text-align:center;
       
          
        }
        

        .container-otherplay{
          margin: 0 auto;
          text-align:center;
          margin-bottom:50px;
        }
        `;
      this.innerHTML = `
        <div class="container-otherplay">
          <hand-component jugada=${this.otherPlay} size="big-big" play="other" class="${this.otherPlay}"></hand-component>
        </div>
        <div class="container-myplay">
          <hand-component jugada=${this.myPlay} size="big-big" play="myplay" class="${this.myPlay}"></hand-component>
        </div>
          `;
      this.appendChild(style);
      //Se muestran las manos por 3 segundos y despues se pushean las jugadas a history
      //Redirecciona a pagina /result
      setTimeout(() => {
        state.pushToHistory();
        Router.go("/result");
      }, 3000);
    }
    render() {
      this.innerHTML = `
        <div class="container">
          <contador-component></contador-component>
          <section class="container-hand"> 
                <hand-component jugada="tijera" size="big" class="hand__tijera"></hand-component>
                <hand-component jugada="piedra" size="big" class="hand__piedra"></hand-component>
                <hand-component jugada="papel" size="big" class="hand__papel"></hand-component>
          </section>
        </div>
        `;

      const style = document.createElement("style");
      style.innerHTML = `
      .container{
        background-image:url(${imgFondo});
        height: 100vh;
      }
      .container-hand{
        position:fixed;
        bottom:-20px;
        left:0;
        right:0;
        max-width:320px;
        width:auto;
        justify-content:space-around;
        gap:100px;
        margin: 0 80px 0 0;
        display:flex;
    }
      @media(min-width:640px){
        .container-hand{
            margin: 0 auto;
        }
      }
      
        `;
      this.appendChild(style);
    }
  }
);
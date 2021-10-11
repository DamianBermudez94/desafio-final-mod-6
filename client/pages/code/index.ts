import { state } from "../../state";
import map from "lodash/map";
import { Router } from "@vaadin/router";
const imgFondo = require("url:../../../client/img/fondopage.png");
customElements.define(
  "code-page",
  class extends HTMLElement {
    gameroomsId: string;
    connectedCallback() {
      //Me suscribo para escuchar cuando la otra persona esté online
      state.subscribe(() => {
        const currentState = state.getState();
        const arrayParticipants = map(currentState.currentGame);

        if (arrayParticipants.length == 2) {
          const isOnline =
            arrayParticipants[0].online && arrayParticipants[1].online;
          const isStart =
            arrayParticipants[0].start || arrayParticipants[1].start;
          //Si los dos participantes estan online y tienen start en false van a la pantalla de instrucciones
          if (isOnline && !isStart) {
            Router.go("/instructions");
          }
        }
        this.gameroomsId = currentState.gameroomsId || "";
        console.log(this.gameroomsId);
        
        this.render();
      });
    }
    render() {
      this.innerHTML = `
      <div class="container">
        <header-component></header-component>
        <section class="text-container">
          <h3>Compartí el código:</h3>
          <h1>${this.gameroomsId}</h1>
          <h3>Con tu contrincante</h3>
        </section>
        <section class="container-hand"> 
              <hand-component jugada="tijera"></hand-component>
              <hand-component jugada="piedra"></hand-component>
              <hand-component jugada="papel"></hand-component>
        </section>
      </div>  
        `;
      const style = document.createElement("style");
      style.innerHTML = `
      *{
        box-sizing:border-box;
      }
      .container{
        background-image:url(${imgFondo});
        height: 100vh;
      }
      .text-container{
        text-align:center;
        margin-top:100px;
      }
      .text-container h1{
        font-size:48px;
        font-weight:700;
        font-family: 'Odibee Sans', cursive;
      }
      .text-container h3{
        font-size:35px;
        font-weight:400;
        font-family: 'Odibee Sans', cursive;
      }
      .container-hand{
        position:fixed;
        bottom:0;
        left:0;
        right:0;
        margin:0 auto;
        width:320px;
        justify-content:space-between;
        display:flex;
    }
      `;
      this.appendChild(style);
    }
  }
);
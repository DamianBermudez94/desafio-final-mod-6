import { Router } from "@vaadin/router";
import { state } from "../../state";
const imgFondo = require("url:../../../client/img/fondopage.png");

customElements.define(
  "home-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      const buttonNewRoom = this.querySelector(".new-room");

      //Dependiendo de que boton elija, se setea roomChoice

      //Si elige newRoom va a la pagina /name
      buttonNewRoom.addEventListener("click", (e) => {
        const currentState = state.getState();
        currentState.roomChoice = "newRoom";
        state.setState(currentState);
        Router.go("/name");
      });

      //Si elige room existente va a la pagina para ingresar el codigo /new-code
      const buttonExistentRoom = this.querySelector(".existent-room");
      buttonExistentRoom.addEventListener("click", (e) => {
        const currentState = state.getState();
        currentState.roomChoice = "existentRoom";
        state.setState(currentState);
        Router.go("/new-code");
      });
    }
    render() {
      this.innerHTML = `
        <section class="content-home">
        <div class="container-component">
          <text-component tag="h1">Piedra Papel o Tijera</text-component> 
          <button-component value="Nuevo juego" class="new-room"></button-component>  
          <button-component value="Ingresar a una sala" class="existent-room"></button-component>    
        </div>
      
          <div class="container-hand"> 
              <hand-component jugada="tijera"></hand-component>
              <hand-component jugada="piedra"></hand-component>
              <hand-component jugada="papel"></hand-component>
          </div>
        </section>
        `;

      const style = document.createElement("style");
      style.innerHTML = `
      .content-home{
        background-image:url(${imgFondo});
        height: 100vh;
        display: flex;
        flex-direction: column;
        margin:0;
        padding:10px;
      }
      .container-component{
        display:flex;
        flex-direction: column;
        justify-content: space-between;
       

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
import { state } from "../../state";

customElements.define(
  "header-component",
  class extends HTMLElement {
    myName: string;
    otherName: string;
    roomShortId: string;
    score: { you: number; other: number };
    connectedCallback() {
      state.subscribe(() => {
        const currentState = state.getState();
        this.score = state.getScore();
        this.myName = currentState.name;
        this.otherName = currentState.otherName;
        this.roomShortId = currentState.gameroomsId || "ningun codigo";
        this.render();
      });
      const currentState = state.getState();
      this.score = state.getScore();
      this.myName = currentState.name;
      this.otherName = currentState.otherName || "";
      this.roomShortId = currentState.gameroomsId || "ningun codigo";
      this.render();
    }
    render() {
      this.innerHTML = `
            <header class="header">
                <div class="names">
                    <p>${this.myName} : ${this.score.you || 0}  </p>
                    <p class="red">${this.otherName || "Player2"} : ${
        this.score.other || 0
      }</p>
                </div>
                <div class="code">
                    <p class="title">Sala</p>
                    <p>${this.roomShortId}</p>
                </div>        
            </header>
            `;
      const style = document.createElement("style");
      style.innerHTML = `
          *{
            box-sizing:border-box;
          }
          .header{
            display:flex;
            justify-content:space-between;
            height:80px;
            width:100%;
            font-family: 'Odibee Sans', cursive;
            font-size:24px;
            font-weight:400;
            margin:10px 0;
          }
          .header p {
            margin:5px 20px;
          }
          .code{
            text-align:right;
          }
          .red{
            color:#FF6442;
          }
          .title{
            font-size:30px;
          }
          
          `;
      this.appendChild(style);
    }
  }
);
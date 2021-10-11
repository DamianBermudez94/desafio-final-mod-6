customElements.define(
    "button-component",
    class extends HTMLElement {
      value: string;
      connectedCallback() {
        this.render();
      }
      render() {
        this.value = this.getAttribute("value");
  
        const style = document.createElement("style");
        style.innerHTML = `
        .container-button{
            display:flex;
            justify-content:center;
            margin: 0 0 20px 0;
        }
        .button{
            width:322px;
            height:100%;
            background-color: var(--background-button);
            border: 10px solid var(--backgound-border-button);
            border-radius: 8px;
            font-size:40px;
            color: var(--color-value-button);
            padding:10px;
            cursor:pointer;
        }
        
        `;
  
        const div = document.createElement("div");
        div.className = "container-button";
        div.innerHTML = `
        <button class="button">${this.value}</button>
        `;
  
        this.appendChild(style);
        this.appendChild(div);
      }
    }
  );
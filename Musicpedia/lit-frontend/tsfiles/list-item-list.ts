import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("list-item-list")
class ToggleSwitchElement extends LitElement {
  sortChildren() {
    //this does not work
    const nodes = Array.from(this.children);
    const sortedNodes = nodes.sort((a, b) => {

      const stadiumA = Array.from(a.children).find((node) => node.getAttribute("slot") === 'Stadium');
      const stadiumB = Array.from(b.children).find((node) => node.getAttribute("slot") === 'Stadium');
      const sta = stadiumA?.textContent;
      const stb = stadiumB?.textContent;
      console.log(stadiumA?.textContent);
      //const stadiumB = b.getAttribute('Stadium');

      return sta.localeCompare(stb);
    });

    // Re-append sorted nodes to the parent element
    sortedNodes.forEach(node => this.appendChild(node));
  }
connectedCallback(): void {
    this.sortChildren()
}
render() {
    return html`
        <div>
          <slot></slot>
    
       </div>
 `
    ;
  }
}
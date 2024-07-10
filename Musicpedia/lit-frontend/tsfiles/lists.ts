import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("list-item")
class ToggleSwitchElement extends LitElement {




  render() {
    return html`
    
      <h1><slot name="Teamname">Teamname</slot></h1>
      <h1><slot name="Stadium">Stadium</slot></h1>
      <h1><slot name="Location">Locations</slot></h1>
      <h1><slot name="Teamcost">TeamCost</slot></h1>
      `
    ;
  }
}


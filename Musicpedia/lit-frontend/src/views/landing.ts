import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../vaadin-router';
import * as App from '../app';
import routes from '../routes';
import update from '../update';
import './user-login'; // Adjust the import path according to your project structure

@customElement('landing-page')
export class BlazingAppElement extends App.Main {
  @state() private isLoggedIn = false;
  @state() private userProfile: { gmail?: string, photoURL?: string } = {};
  @state() private picurl = "../def.jpg";

  constructor() {
    super(update);
    this.addGlobalStyle();
    this.addEventListener('login-success', () => {
      this.isLoggedIn = true;
    
    });
  }

  addGlobalStyle() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        background: linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        animation: gradientBG 15s ease infinite;
        color: white;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100vh;
      }

      @keyframes gradientBG {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      justify-content: flex-start;
    }

    .title-container {
      text-align: center;
      padding-top: 1rem;
    }

    .pagetitle {
      font-size: 48px;
      font-weight: bold;
      color: #FFFFFF;
      text-shadow: 0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF, 0 0 40px #FF00FF, 0 0 50px #FF00FF, 0 0 60px #FF00FF;
      margin: 0 auto;
      animation: neon 1.5s ease-in-out infinite alternate;
    }

    .navbar {
      display: flex;
      flex-direction: vertical;
      align-items: center;
      justify-content: center;
      gap: 20px; /* Increase gap for better visibility between items */
    }

    a {
      font-weight: bold;
      color: #FFFFFF;
      text-decoration: none;
      font-size: 24px; /* Increase font size for bigger navbar items */
      padding: 15px 30px; /* Increase padding for larger clickable areas */
      margin: 5px 0; /* Adjust margin as needed */
      border-radius: 8px; /* Slightly larger border-radius for aesthetics */
      transition: transform 0.2s, background-color 0.5s;
      background-color: rgba(255, 255, 255, 0.1); /* Optional: add a slight background color */
    }

    a:hover {
      transform: scale(1.1);
      background-color: rgba(255, 255, 255, 0.2);
    }
    .user-dropdown-container {
      position: fixed; /* Use fixed to position relative to the viewport */
      top: 0; /* Align to the top of the viewport */
      right: 0; /* Align to the right of the viewport */
      margin: 10px; /* Add some margin */
    }
    
    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      color: black;
      right: 0; /* Align the dropdown content to the right */
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      padding: 12px 16px;
      z-index: 1;
    }

    .dropdown:hover .dropdown-content {
      display: block;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .profile-photo {
      border-radius: 50%;
      width: 40px;
      height: 40px;
     
    }
  `;
  navigateTo(path: string) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('vaadin-router-go', { detail: { pathname: path } }));
  }

  render() {
    return html`
    
    <div class="user-dropdown-container">
    ${this.isLoggedIn ? html`
      <div class="dropdown">
        <img src="./l.jpg" class="profile-photo">
        <div class="dropdown-content">
          <div class="user-info">
            <strong>Gmail:</strong>
            <span>${this.userProfile.gmail}</span>
          </div>
        
        </div>
      </div>
    ` : ''}
    
  </div>
      ${this.isLoggedIn ? html`
        <div class="title-container">
          <header class="pagetitle">Musicpedia</header>
        </div>
        
        
        <nav class="navbar">
          <a @click="${() => this.navigateTo('/')}">Home</a>
          <a @click="${() => this.navigateTo('/app/song')}">Songs</a>
          <a @click="${() => this.navigateTo('/app/album')}">Albums</a>
          <a @click="${() => this.navigateTo('/app/topsongs')}">Top Songs</a>
          
        </nav>
        <vaadin-router .routes=${routes}></vaadin-router>
      ` : html`
        <div class="title-container">
          <header class="pagetitle">Musicpedia</header>
        </div>
        <user-login></user-login>
      `}
    `;
  }
}

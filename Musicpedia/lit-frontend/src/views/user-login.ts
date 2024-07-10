import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('user-login')
export class UserLogin extends LitElement {
  @state() private email = '';
  @state() private password = '';
  @state() private errorMessage = '';

  static styles = css`
    /* Custom styles */
    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 300px;
      margin: auto;
    }

    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    button {
      cursor: pointer;
    }

    .error-message {
      color: red;
    }
  `;

  private async handleLogin(e: Event) {
    e.preventDefault(); // Prevent the form from submitting traditionally
    this.performAuthentication('login');
  }

  private async handleSignup(e: Event) {
    e.preventDefault(); // Prevent the form from submitting traditionally
    this.performAuthentication('signup');
  }
  private async performAuthentication(action: 'login' | 'signup'): Promise<void> {
    this.errorMessage = '';

    try {
      let response: Response;
      let apiURL = '';
      let requestData: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gmail: this.email, password: this.password }),
      };

      if (action === 'signup') {
        apiURL = 'http://localhost:3000/api/signup';
      } else {
        // Adjust requestData for a login action if necessary
        apiURL = `http://localhost:3000/api/login?gmail=${encodeURIComponent(this.email)}&password=${encodeURIComponent(this.password)}`;
        requestData = { method: 'GET' }; // Adjust if your login endpoint expects a GET request
      }

      response = await fetch(apiURL, requestData);

      if (!response.ok) {
        throw new Error(`${action} failed: ${response.status} ${response.statusText}`);
      }

      // Dispatch 'login-success' event for both login and signup
      this.dispatchEvent(new CustomEvent('login-success', { bubbles: true, composed: true }));
      this.errorMessage = ''; // Clear any previous error message
    } catch (error: any) {
      console.error(`${action} error:`, error);
      this.errorMessage = `${action.charAt(0).toUpperCase() + action.slice(1)} failed. Please try again.`;
      this.requestUpdate(); // Request update to show the error message
    }
  }
  
  private updateEmail(e: Event) {
    this.email = (e.target as HTMLInputElement).value;
  }

  private updatePassword(e: Event) {
    this.password = (e.target as HTMLInputElement).value;
  }

  render() {
    return html`
      <form class="login-form" @submit="${this.handleLogin}">
        <div class="form-field">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" .value="${this.email}" @input="${this.updateEmail}" required>
        </div>
        <div class="form-field">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" .value="${this.password}" @input="${this.updatePassword}" required>
        </div>
        ${this.errorMessage ? html`<div class="error-message">${this.errorMessage}</div>` : ''}
        <div class="action-buttons">
          <button type="submit" @click="${this.handleLogin}">Login</button>
          <button type="button" @click="${this.handleSignup}">Signup</button>
        </div>
      </form>
    `;
  }
}

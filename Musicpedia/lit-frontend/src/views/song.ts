import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import * as App from "../app";
@customElement('lyric-finder')
export class LyricFinder extends App.View {
  @state() artistName: string = '';
  @state() songName: string = '';
  @state() lyrics: string = '';
  @state() error: boolean = false;

  static styles = css`
  :host {
    display: block;
    text-align: center; /* Center align the content */
  }
  .container {
    max-width: 800px; /* Adjust based on preference */
    margin: 0 auto; /* Center the container */
    padding: 20px;
  }
  .input-field {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: calc(100% - 24px); /* Full width minus padding and border */
    box-sizing: border-box; /* Include padding and border in the element's total width */
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.7); /* Cyan glow */
    transition: box-shadow 0.3s ease-in-out;
  }
  .input-field:focus {
    box-shadow: 0 0 15px rgba(0, 255, 255, 1); /* Stronger cyan glow on focus */
    outline: none; /* Remove default focus outline */
  }
  .btn-find {
    cursor: pointer;
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.7); /* Cyan glow */
    transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  .btn-find:hover {
    background-color: #0056b3; /* Darker blue on hover */
    box-shadow: 0 0 15px rgba(0, 255, 255, 1); /* Stronger cyan glow on hover */
  }
  .lyrics-box {
    margin-top: 20px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.9); /* Slightly more translucent */
    border-radius: 10px;
    color: #8B0000; /* Dark red for high contrast and visibility */
    white-space: pre-wrap;
    max-width: 80%;
    margin: 20px auto; /* Center the lyrics box */
    text-align: left; /* Align the lyrics text to the left */
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.7); /* Cyan glow */
    text-shadow: 0 0 5px #8B0000, 0 0 10px #8B0000, 0 0 15px #8B0000, 0 0 20px #8B0000; /* Dark red neon text glow effect */
  }
  .error-box {
    display: block;
    color: red;
    margin-top: 20px;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.7); /* Red glow for errors */
  }
  p {
    text-align: center; /* Center-align the paragraph text */
  }
`;

  render() {
    return html`
    
      <div class="container">
        <h2>Lyric Finder</h2>
        <input 
          class="input-field" 
          type="text" 
          placeholder="Artist Name" 
          .value="${this.artistName}" 
          @input="${e => this.artistName = e.target.value}">
        <input 
          class="input-field" 
          type="text" 
          placeholder="Song Name" 
          .value="${this.songName}" 
          @input="${e => this.songName = e.target.value}">
        <button 
          class="btn-find" 
          @click="${this.getLyrics}">Find Lyrics</button>
        <div class="lyrics-box">
          ${this.lyrics ? unsafeHTML(this.lyrics) : html`<p>Enter artist and song name to find lyrics.</p>`}
        </div>
        ${this.error ? html`<div class="error-box">Sorry! Lyrics not found.</div>` : ''}
      </div>
    `;
  }

  getLyrics() {
    if (this.artistName !== '' && this.songName !== '') {
      this.error = false;
      fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(this.artistName)}/${encodeURIComponent(this.songName)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.lyrics) {
            this.lyrics = data.lyrics.replace(/\n/g, '<br>'); // Replace newline characters with <br> for HTML rendering
          } else {
            throw new Error('Lyrics not found');
          }
        })
        .catch(() => {
          this.error = true;
          this.lyrics = '';
        });
    } else {
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 2500);
    }
  }
}

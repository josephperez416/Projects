import { LitElement, html, css} from 'lit';
import { customElement, property, state  } from 'lit/decorators.js';
import * as App from "../app";
@customElement('top-tracks')
class SpotifyArtistSearchTopTracks extends App.View {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      box-sizing: border-box;
    }
  
    .track {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      border-radius: 5px;
      padding: 10px;
      background-color: transparent;
      transition: transform 0.2s ease-in-out;
    }
    .neon-green, .neon-red, .neon-blue, .neon-yellow {
      animation: neon-animation 3s ease-in-out infinite alternate;
    }
    .neon-green {
      box-shadow: 0 0 5px #39FF14, 0 0 15px #39FF14, 0 0 25px #39FF14, 0 0 35px #39FF14;
      color: #39FF14;
    }
    .neon-red {
      box-shadow: 0 0 5px #FF073A, 0 0 15px #FF073A, 0 0 25px #FF073A, 0 0 35px #FF073A;
      color: #FF073A;
    }
    .neon-blue {
      box-shadow: 0 0 5px #00C9FF, 0 0 15px #00C9FF, 0 0 25px #00C9FF, 0 0 35px #00C9FF;
      color: #00C9FF;
    }
    .neon-yellow {
      box-shadow: 0 0 5px #FFFB00, 0 0 15px #FFFB00, 0 0 25px #FFFB00, 0 0 35px #FFFB00;
      color: #FFFB00;
    }
    @keyframes neon-animation {
      from {
        text-shadow: 0 0 10px;
      }
      to {
        text-shadow: 0 0 20px;
      }
    }
    .track img {
      width: 64px;
      height: 64px;
      margin-right: 20px;
      border-radius: 5px;
    }
    .track-info {
      display: flex;
      flex-direction: column;
    }
    audio {
      margin-top: 10px;
    }
    .artist-search {
      margin-bottom: 20px;
      margin-top: 70px; /* Adjust this value to ensure it does not collide with the navbar */
    }
    .artist-search input {
      padding: 12px 20px;
      background-color: rgba(255, 255, 255, 0.8);
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 8px #7CFC00, 0 0 20px #7CFC00, 0 0 30px #7CFC00, 0 0 40px #7CFC00;
      color: #000;
      font-size: 16px;
      width: calc(100% - 48px);
      box-sizing: border-box;
      transition: box-shadow 0.3s ease-in-out;
    }
    .artist-search input:focus {
      outline: none;
      box-shadow: 0 0 12px #7CFC00, 0 0 22px #7CFC00, 0 0 32px #7CFC00, 0 0 42px #7CFC00;
    }
    ul {
      list-style-type: none;
      padding: 0px;
    }
    .start-button {
      /* Style your button here */
      padding: 8px 16px;
      border: none;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      margin-left: 10px; // Add a little space between the button and title
    }

  `;
  @property({ type: String })
  accessToken: string = 'BQDivAJfo3FMGUnbDiNcVzya82IkGFBR8tJpM3oExQoQOG_FVcvj7hnUW3OqKIetynAvZf2_64yx4e81HzbP8YfK5n3DNWlEdmnC2mCvBHpcRIx0dkA';

  @state()
  private artistName: string = '';

  @state()
  private topTracks: Array<any> = [];

  async searchArtist(): Promise<void> {
    if (!this.artistName.trim()) return;

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      this.artistName
    )}&type=artist&limit=1`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.artists.items.length > 0) {
        const artistId = data.artists.items[0].id;
        this.fetchTopTracks(artistId);
      } else {
        this.topTracks = [];
        alert('Artist not found. Please try another search.');
      }
    } catch (error) {
      console.error('Error searching for artist:', error);
    }
  }

  async fetchTopTracks(artistId: string): Promise<void> {
    const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      this.topTracks = data.tracks;
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  }
  neonColors = ['neon-green', 'neon-red', 'neon-blue', 'neon-yellow'];

  getRandomNeonClass() {
    return this.neonColors[Math.floor(Math.random() * this.neonColors.length)];
  }
  goBack() {
    window.history.back(); // Use the history API to go back
    // Or if you have a routing function for 'topsongs', call that function here
  }
  
  render() {
    return html`
      
      <div class="artist-search">
        <input
          type="text"
          placeholder="Enter artist's name"
          @input="${(e: Event) => {
            this.artistName = (e.target as HTMLInputElement).value;
          }}"
        />
        <button @click="${this.searchArtist}">Search</button>
      </div>

      
      ${this.topTracks.length > 0
        ? html`
        <div class="header-container">
          <h1 class="start">Top Songs</h1>
          <button @click="${this.goBack}" class="start-button">Back</button>
        </div>
        <ul class="stuffinside">
          ${this.topTracks.map(track => html`
            <li class="track ${this.getRandomNeonClass()}">
              <img src="${track.album.images[0].url}" alt="${track.name}">
              <div class="track-info">
                <strong>${track.name}</strong> - ${track.album.name}
                <audio controls src="${track.preview_url}"></audio>
              </div>
            </li>
          `)}
        </ul>
      `
        : ''}
        
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'spotify-artist-search-top-tracks': SpotifyArtistSearchTopTracks;
  }
}

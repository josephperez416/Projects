import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as App from "../app";
interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
}

@customElement('artist-albums')
class SpotifyArtistAlbums extends App.View {
  @property({ type: String })
  artistName: string = '';

  @state()
  artistId: string = '';

  @state()
  albums: Album[] = [];

  static styles = css`
    :host {
      display: block;
      text-align: center;
      
    }
 
    .album {
      margin: 10px;
      padding: 10px;
      border: 3px solid transparent;
      display: inline-block;
      text-align: center;
      background-clip: padding-box;
      transition: transform 0.2s ease-in-out;
    }
    /* Neon classes for albums */
    .neon-green, .neon-red, .neon-blue, .neon-yellow {
      box-shadow: 0 0 5px, 0 0 15px, 0 0 25px, 0 0 35px;
    }
    .neon-green { box-shadow: 0 0 5px #39FF14, 0 0 15px #39FF14, 0 0 25px #39FF14, 0 0 35px #39FF14; }
    .neon-red { box-shadow: 0 0 5px #FF073A, 0 0 15px #FF073A, 0 0 25px #FF073A, 0 0 35px #FF073A; }
    .neon-blue { box-shadow: 0 0 5px #00C9FF, 0 0 15px #00C9FF, 0 0 25px #00C9FF, 0 0 35px #00C9FF; }
    .neon-yellow { box-shadow: 0 0 5px #FFFB00, 0 0 15px #FFFB00, 0 0 25px #FFFB00, 0 0 35px #FFFB00; }
    /* Styling for input to match the white box with neon effect */
    input {
      margin: 10px 0;
      padding: 12px 20px;
      background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent white */
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 8px #7CFC00, 0 0 20px #7CFC00, 0 0 30px #7CFC00, 0 0 40px #7CFC00; /* Neon glow effect */
      color: #000; /* Text color */
      font-size: 16px;
      width: calc(100% - 48px); /* Full width minus padding */
      box-sizing: border-box; /* Include padding in width calculation */
      transition: box-shadow 0.3s ease-in-out;
    }
    input:focus {
      outline: none;
      box-shadow: 0 0 12px #7CFC00, 0 0 22px #7CFC00, 0 0 32px #7CFC00, 0 0 42px #7CFC00; /* Intensified glow on focus */
    }
    button {
      cursor: pointer;
      background-color: #121212;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      box-shadow: 0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14, 0 0 20px #39FF14; /* Neon glow */
      transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
    button:hover {
      background-color: #0e0e0e;
      box-shadow: 0 0 8px #39FF14, 0 0 18px #39FF14, 0 0 28px #39FF14, 0 0 38px #39FF14; /* Enhanced glow on hover */
    }
  `;
neonColors = ['neon-green', 'neon-red', 'neon-blue', 'neon-yellow'];

getRandomNeonClass() {
  return this.neonColors[Math.floor(Math.random() * this.neonColors.length)];
}

  async fetchArtistId(): Promise<void> {
    if (!this.artistName.trim()) return;
    const accessToken = 'BQDivAJfo3FMGUnbDiNcVzya82IkGFBR8tJpM3oExQoQOG_FVcvj7hnUW3OqKIetynAvZf2_64yx4e81HzbP8YfK5n3DNWlEdmnC2mCvBHpcRIx0dkA'; // Replace with your actual access token
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(this.artistName)}&type=artist`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.artists.items.length > 0) {
        this.artistId = data.artists.items[0].id;
        this.fetchAlbums();
      } else {
        this.albums = []; // Clear albums if no artist is found
      }
    } catch (error) {
      console.error('Error fetching artist ID:', error);
    }
  }

  async fetchAlbums(): Promise<void> {
    if (!this.artistId) return;
    const accessToken = 'BQDivAJfo3FMGUnbDiNcVzya82IkGFBR8tJpM3oExQoQOG_FVcvj7hnUW3OqKIetynAvZf2_64yx4e81HzbP8YfK5n3DNWlEdmnC2mCvBHpcRIx0dkA'; // Replace with your actual access token
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${this.artistId}/albums`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      this.albums = data.items;
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  }

  renderAlbum(album: Album) {
    const neonClass = this.getRandomNeonClass();
    return html`
      <div class="album ${neonClass}">
        <img src=${album.images[0]?.url} alt="Album Cover" width="100">
        <div>${album.name}</div>
        <div>${album.release_date}</div>
      </div
    `;
  }

  render() {
    return html`
      <div>
        <input type="text" .value=${this.artistName} @input=${e => this.artistName = e.target.value} placeholder="Enter artist name">
        <button @click=${this.fetchArtistId}>Search</button>
      </div>
      <div class="albums-container">
        ${this.albums.map(album => this.renderAlbum(album))}
      </div>
    `;
  }
}

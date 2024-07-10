// https://api.lyrics.ovh/v1/bobby%20v/slow%20down

const inputArtist = document.querySelector('.input-artist');
const inputSong = document.querySelector('.input-song');
const button = document.querySelector('.find-btn');
const songDesc = document.querySelector('.song-desc');
const lyricField = document.querySelector('.lyric-text');
const errorBox = document.querySelector('.error-box');

button.addEventListener('click', getLyrics);

//errorBox.style.display = 'none';

function getLyrics() {
    let artistVal = inputArtist.value;
    let songVal = inputSong.value;

    if (artistVal !== '' && songVal !== '') {
        errorBox.style.display = 'none';
        fetch(`https://api.lyrics.ovh/v1/${artistVal}/${songVal}`)
        .then(response => response.json())
        .then(lyric => {
            let song = `${artistVal}-${songVal}`.split('-');
            let artistName = song[0].split(' ').map(elem => elem[0].toUpperCase() + elem.slice(1)).join(' ');
            let songName = song[1].split(' ').map(elem => elem[0].toUpperCase() + elem.slice(1)).join(' ');
    
            songDesc.textContent = `${artistName} - ${songName}`;
            
            let lyrics = lyric.lyrics.split("\n").join("<br />");
            
            lyricField.innerHTML = lyrics;
    
            inputArtist.value = '';
            inputSong.value = '';
        })
        .catch(err => {
            errorBox.style.display = 'block';
            errorBox.firstElementChild.nextElementSibling.textContent = 'Sorry! Lyrics not found.';
            setTimeout(() => {
                errorBox.style.display = 'none';
            }, 2500);
        });

    } else {
        errorBox.style.display = 'block';
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 2500);
    }

}
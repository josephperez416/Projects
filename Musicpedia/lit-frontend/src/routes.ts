
import "./views/song"
import "./views/albums"
import "./views/topSongs"
import "./views/user-login"

export default [
{ path: "", component: "landing-page"},
{ path: "/app/song", component: "lyric-finder" },
{ path: "/app/album", component: "artist-albums" },
{ path: "/app/topsongs", component: "top-tracks" },
{ path: "/app/login", component: "user-login" },
]


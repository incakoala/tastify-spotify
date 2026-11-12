import React from 'react'
import '../App.css'

// Spotify redirects back to whatever domain the app is served from
// (Netlify in production, 127.0.0.1 locally). That URL must be whitelisted in the
// Spotify developer dashboard.
var redirect_uri = process.env.REACT_APP_REDIRECT_URI || window.location.origin;

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=b2d89a8ed2a5494196384e30483c4706&response_type=code&redirect_uri=${redirect_uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-top-read%20user-read-playback-position`

export default function Login() {
  return (
    <a href={AUTH_URL} className="login-text">Login with Spotify</a>
  )
}

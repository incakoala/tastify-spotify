import React from 'react'
import '../App.css'

var PROD = process.env.NODE_ENV === 'production' ? true : false;
var redirect_uri = PROD ? 'https://tastify-spotify-74b017a66560.herokuapp.com' : 'http://localhost:3000';

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=b2d89a8ed2a5494196384e30483c4706&response_type=code&redirect_uri=${redirect_uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-top-read%20user-read-playback-position`

export default function Login() {
  return (
    <a href={AUTH_URL} class="login-text">Login with Spotify</a>
  )
}

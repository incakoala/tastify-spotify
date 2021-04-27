import React, { useState, useEffect } from 'react'

import { Container } from "react-bootstrap"

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=b2d89a8ed2a5494196384e30483c4706&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-top-read%20user-read-playback-position"

export default function Login() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }} >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>Login With Spotify</a>
    </Container>
  )
}

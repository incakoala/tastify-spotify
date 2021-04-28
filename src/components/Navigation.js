import React, { useState } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import Logo from "../logo.svg"
export default function Navigation({ setShowGenre, setShowArtist, setShowPlaylist, code, setCode }) {
  const _code = code

  return (
    <>
      <Navbar className="my-navbar">
        <Navbar.Brand className="navbar-brand">
          {/* <img
            alt=""
            src={Logo}
            width="30"
            height="50"
          // className="d-inline-block align-top"
          />{' '} */}
          <div className="navbar-brand-name">Tastify</div>
        </Navbar.Brand>

        <Nav.Link className="navbar-link" onClick={() => {
          // setCode(_code)
          setShowGenre(true)
          setShowArtist(false)
          setShowPlaylist(false)
        }}>Genre</Nav.Link>

        <Nav.Link className="navbar-link" onClick={() => {
          setShowArtist(true)
          setShowGenre(false)
          setShowPlaylist(false)
        }}>Artist</Nav.Link>

        <Nav.Link className="navbar-link" onClick={() => {
          setShowPlaylist(true)
          setShowGenre(false)
          setShowArtist(false)
        }}>TastePlaylist</Nav.Link>

        {/* <Nav.Link href="/">Genre</Nav.Link>
        <Nav.Link href="/artist">Artist</Nav.Link>
        <Nav.Link href="/tastify-playlist">Tastify Playlist</Nav.Link> */}
        {/* <li><Link to="/genre">Genre</Link></li>
      <li><Link to="/artist">Artist</Link></li>
      <li><Link to="/tastify-playlist">Tastify Playlist</Link></li> */}
      </Navbar>
    </>
  )
}

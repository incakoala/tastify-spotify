import React from 'react'
import { Navbar, Nav, Badge } from 'react-bootstrap';
import '../App.css';
import Logo from "../logo.svg"
export default function Navigation({ setShowGenre, setShowArtist, setShowAudioFeature, setShowPlaylist }) {
  return (
    <>
      <Navbar collapseOnSelect expand="md" className="my-navbar">
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
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='mx-4' variant="pills" defaultActiveKey="link-1">
            <Nav.Item>
              <Nav.Link className="navbar-link" eventKey="link-1"
                onClick={() => {
                  // setCode(_code)
                  setShowGenre(true)
                  setShowArtist(false)
                  setShowPlaylist(false)
                  setShowAudioFeature(false)

                }}>Genre</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link className="navbar-link" eventKey="link-2"
                onClick={() => {
                  setShowArtist(true)
                  setShowGenre(false)
                  setShowPlaylist(false)
                  setShowAudioFeature(false)
                }}>Artist</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link className="navbar-link" eventKey="link-3"
                onClick={() => {
                  setShowAudioFeature(true)
                  setShowPlaylist(false)
                  setShowGenre(false)
                  setShowArtist(false)
                }}>Audio Feature</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

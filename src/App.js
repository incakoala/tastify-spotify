import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from "./components/Login";
import Navigation from "./components/Navigation"
import useAuth from "./components/useAuth"
import Genre from "./components/Genre";
import Artist from "./components/Artist";
import TastifyPlaylist from './components/TastifyPlaylist'

import React, { useState, useEffect } from 'react'
import { Container, Navbar } from "react-bootstrap"

import Logo from "./logo.svg"

// const code = new URLSearchParams(window.location.search).get('code');

export default function App() {

  const [code, setCode] = useState(new URLSearchParams(window.location.search).get('code'))
  const accessToken = useAuth(code)
  const [showGenre, setShowGenre] = useState(false)
  const [showArtist, setShowArtist] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)

  useEffect(() => {
    if (code && !showGenre && !showArtist && !showPlaylist) {
      setShowGenre(true)
    }
  }, [code, setShowGenre, showGenre, showArtist, showPlaylist])

  return (
    <div>
      {code ?
        <Navigation
          setShowGenre={setShowGenre}
          setShowArtist={setShowArtist}
          setShowPlaylist={setShowPlaylist}
        />
        :
        <>
          <div className='background-img'>
            <div className="home-text"><span style={{ fontSize: '80px' }}>TASTIFY </span><br></br>"Dicover Your Music Taste"</div>
            <Login />

          </div>
          <Navbar className="my-footer" fixed="bottom">
            <div style={{ marginLeft: 'auto', marginRight: '0' }} >
              <a class='footer-text' href="https://github.com/incakoala">Made by incakoala</a>
            </div>
          </Navbar>
        </>
      }

      {showGenre === true ?
        <Genre code={code} accessToken={accessToken} />
        : <> </>
      }
      {showArtist === true ?
        <Artist code={code} accessToken={accessToken} />
        : <> </>
      }
      {showPlaylist === true ?
        <TastifyPlaylist code={code} accessToken={accessToken} />
        : <> </>
      }
    </div>

  )
}
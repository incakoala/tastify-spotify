import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react'
import { Navbar } from "react-bootstrap"
import Login from "./components/Login";
import Navigation from "./components/Navigation"
import useAuth from "./components/useAuth"
import Genre from "./components/Genre";
import Artist from "./components/Artist";
import AudioFeature from './components/AudioFeature'

export default function App() {
  const [code, setCode] = useState(new URLSearchParams(window.location.search).get('code'))
  const accessToken = useAuth(code)
  const [showGenre, setShowGenre] = useState(false)
  const [showArtist, setShowArtist] = useState(false)
  const [showAudioFeature, setShowAudioFeature] = useState(false)

  useEffect(() => {
    if (code && !showGenre && !showArtist && !showAudioFeature) {
      setShowGenre(true)
    }
  }, [code, setShowGenre, showGenre, showArtist, showAudioFeature])

  return (
    <div>
      {code ?
        <Navigation
          setShowGenre={setShowGenre}
          setShowArtist={setShowArtist}
          setShowAudioFeature={setShowAudioFeature}
        />
        :
        <>
          <div className='background-img'>
            <div className="home-text"><span style={{ fontSize: '80px' }}>
              TASTIFY </span><br></br>Dicover Your Music Taste<br></br><Login />
            </div>
          </div>
          <Navbar className="footer-wrapper" fixed="bottom">
            <div style={{ marginLeft: 'auto', marginRight: '0', height: '50px' }} >
              <a className='footer-text' href="https://github.com/incakoala">Made by incakoala</a>
            </div>
          </Navbar>
        </>
      }

      {showGenre === true ?
        <Genre accessToken={accessToken} />
        : <> </>
      }
      {showArtist === true ?
        <Artist accessToken={accessToken} />
        : <> </>
      }
      {showAudioFeature === true ?
        <AudioFeature accessToken={accessToken} />
        : <> </>
      }
    </div>

  )
}
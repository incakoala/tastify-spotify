import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from "./components/Login";
import Navigation from "./components/Navigation"
import useAuth from "./components/useAuth"
import Genre from "./components/Genre";
import Artist from "./components/Artist";
import TastifyPlaylist from './components/TastifyPlaylist'

import React, { useState, useEffect } from 'react'
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
            <Login />
          </div>
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
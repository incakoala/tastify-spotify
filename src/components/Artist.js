import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"
import Player from './Player'
import Playlist from './Playlist'
import Donut from './Donut'
import './Category.css'
import Square from './rounded-black-square-shape.svg'

const spotifyApi = new SpotifyWebApi({
  clientId: "b2d89a8ed2a5494196384e30483c4706"
})
export default function Artist({ accessToken, code }) {
  const [topCategories, setTopCategories] = useState([])
  const [clickedGenre, setClickedGenre] = useState({})
  const [currPlaylist, setCurrPlaylist] = useState([])
  const [currPlayingTrack, setCurrPlayingTrack] = useState()
  const [currPlayingTrackInfo, setCurrPlayingTrackInfo] = useState([])
  const [totalTopSongs, setTotalTopSongs] = useState(0) // for calculating %
  const [numberOfItems, setNumberOfItems] = useState(10) // for display
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!accessToken) return

    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return

    if (clickedGenre !== {} || clickedGenre !== "") getTopTracksFromGenre(clickedGenre.genre)
  }, [clickedGenre, accessToken])


  // Get user's top artists
  useEffect(() => {
    if (!accessToken) return

    spotifyApi
      // start by getting user's top tracks
      .getMyTopTracks({ limit: 50, time_range: "long_term" })
      // only take the first artist of a track
      .then((data) => {
        setTotalTopSongs(data.body.items.length)

        return data.body.items.map((track) => track.artists)
      })
      // flatten array
      .then((artists) => {
        return [].concat.apply([], artists)
          .map((artist) => artist)
          .reduce((result, item) => {
            result.push(item)
            return result
          }, [])
      })
      // save name
      .then((artistsObject) => {
        return artistsObject.map((obj) => {
          return obj.name
        })
      })
      // map artists' occurences
      .then((artistsList) => {
        return [].concat.apply([], artistsList)
          .reduce((result, item) => {
            const get = (k) => {
              return result[k]
            }
            if (get(item) === undefined) {
              result[item] = 1
            }
            else if (get(item) !== undefined) {
              result[item] = result[item] + 1
            }
            return result
          }, {})
      })
      // transform to {x: artist, y: numSongs} object so that VictoryChart
      // can display the data
      .then((topArtists) => {
        return Object.keys(topArtists).slice(0, Object.keys(topArtists).length)
          .reduce((result, item) => {
            result.push({
              x: item,
              y: topArtists[item]
            })
            return result
          }, [])
          .sort((a, b) => {
            return (a.y > b.y) ? -1 : (a.y === b.y) ? ((a.y > b.y) ? -1 : 1) : 1
          })
      })
      .then((finalTopArtists) => {
        setTopCategories(finalTopArtists)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [accessToken])

  // Get user's top tracks from an artist
  const getTopTracksFromGenre = (inputArtist) => {
    spotifyApi
      .getMyTopTracks({ limit: 50, time_range: "long_term" })
      .then((data) => {
        return data.body.items
          .map((track) => track)
          .reduce((result, item) => {
            const largestAlbumImage = item.album.images.reduce(
              (largest, image) => {
                if (image.height > largest.height) return image
                return largest
              },
              item.album.images[0]
            )
            const convertDuration = () => {
              var minutes = Math.floor(item.duration_ms / 60000);
              var seconds = ((item.duration_ms % 60000) / 1000).toFixed(0);
              return minutes + ":" + (item.duration_ms < 10 ? '0' : '') + seconds;
            }
            const getArtistsList = (artists) => {
              return artists
                .map((artist) => artist)
                .reduce((result, item) => {
                  result.push(item.name)
                  return result
                }, [])
            }
            result.push({
              artists: getArtistsList(item.artists),
              track: item.name,
              trackUri: item.uri,
              trackDuration: convertDuration(),
              albumUrl: largestAlbumImage.url
            })
            return result
          }, [])
      })
      // set final playlist
      .then((finalList) => {
        return setCurrPlaylist(
          finalList
            .filter((g) => {
              return g.artists.includes(inputArtist)
            })
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Container fluid>
      <Row className="content-wrapper">
        <Col className="playlist-wrapper">
          <div>
            <div className="info-text"><span style={{ fontFamily: 'Staatliches' }}>Top
            <span class="info-text-highlight"> {clickedGenre.genre} </span>Songs</span></div>
            <Playlist
              currPlaylist={currPlaylist}
              currPlayingTrack={currPlayingTrack}
            />
          </div>
        </Col>

        <Col xl={{ span: 5 }} className="donut-wrapper">
          <Nav justify variant="tabs" defaultActiveKey="10">
            <Nav.Item className="tab">
              <Nav.Link
                className="tab-item"
                eventKey="10"
                onClick={() => {
                  setNumberOfItems(10)
                }}
              >
                Top 10
                </Nav.Link>
            </Nav.Item>

            <Nav.Item className="tab">
              <Nav.Link
                className="tab-item"
                eventKey="25"
                onClick={() => {
                  setNumberOfItems("25")
                }}
              >
                Top 25
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="tab">
              <Nav.Link
                className="tab-item"
                eventKey="50"
                onClick={() => {
                  setNumberOfItems("50")
                }}
              >
                Top 50
                </Nav.Link>
            </Nav.Item>
          </Nav>

            <Donut className="donut"
              topCategories={topCategories}
              clickedGenre={clickedGenre}
              setClickedGenre={setClickedGenre}
              setCurrPlaylist={setCurrPlaylist}
              currPlayingTrack={currPlayingTrack}
              currPlayingTrackInfo={currPlayingTrackInfo}
              numberOfItems={numberOfItems}
              isPaused={isPaused}
            />
        </Col>

        <Col className="text-wrapper">
          {currPlaylist.length > 0 ?
            <div className="info-text">
              <span className="info-text-highlight">{clickedGenre.genre} </span> accounts for
              <span className="info-text-highlight"> {Math.round(clickedGenre.numSongs / totalTopSongs * 100)}% </span> of your top songs
            </div>
            :
            <div className="info-text">
            Discover Your <br></br>
              <span className="info-text-highlight">top artists </span> <br></br>
              on Spotify!
            </div>
          }
        </Col>
      </Row>

      <Navbar className="footer-wrapper" fixed="bottom">
        <img src={Square} style={{ width: '210px', height: '50px' }} />

        <Player
          accessToken={accessToken}
          trackUris={currPlaylist}
          setCurrPlayingTrack={setCurrPlayingTrack}
          currPlayingTrackInfo={currPlayingTrackInfo}
          setCurrPlayingTrackInfo={setCurrPlayingTrackInfo}
          setIsPaused={setIsPaused}
        />

        <a className='footer-text' href="https://github.com/incakoala">Made by incakoala</a>
      </Navbar>

    </Container >
  )
}
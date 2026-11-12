import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"
import Player from './Player'
import Playlist from './Playlist'
import Donut from './Donut'
import './Category.css'
import { withRetry, mapWithConcurrency } from './spotifyRequest'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID
})
export default function Genre({ accessToken }) {
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

  // Top tracks with their first artist's genres, loaded once per login.
  // Clicking a genre only filters this list, so it needs no extra requests.
  const [tracksWithGenres, setTracksWithGenres] = useState([])

  useEffect(() => {
    if (!clickedGenre.genre) return
    setCurrPlaylist(
      tracksWithGenres.filter((t) => t.genres.includes(clickedGenre.genre))
    )
  }, [clickedGenre, tracksWithGenres])

  // Get user's top tracks and top genres
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false

    const load = async () => {
      // Top tracks rarely change; one request is enough
      const topTracks = await withRetry(() =>
        spotifyApi.getMyTopTracks({ limit: 50, time_range: "long_term" })
      )
      const items = topTracks.body.items
      setTotalTopSongs(items.length)

      // Genres live on artists. Fetch each distinct artist once, a few at a
      // time, instead of 50+ sequential requests per click.
      const artistIds = [...new Set(items.map((t) => t.artists[0].id))]
      const genresByArtist = {}
      await mapWithConcurrency(artistIds, 5, async (id) => {
        const res = await withRetry(() => spotifyApi.getArtist(id))
        genresByArtist[id] = res.body.genres || []
      })
      if (cancelled) return

      const list = items.map((item) => {
        const largestAlbumImage = item.album.images.reduce(
          (largest, image) => (image.height > largest.height ? image : largest),
          item.album.images[0]
        )
        const minutes = Math.floor(item.duration_ms / 60000)
        const seconds = Math.floor((item.duration_ms % 60000) / 1000)
        return {
          artist: item.artists[0].name,
          genres: genresByArtist[item.artists[0].id] || [],
          track: item.name,
          trackUri: item.uri,
          trackDuration: minutes + ":" + String(seconds).padStart(2, '0'),
          albumUrl: largestAlbumImage ? largestAlbumImage.url : undefined
        }
      })
      setTracksWithGenres(list)

      // Count how many top songs fall into each genre
      const counts = {}
      list.forEach((t) => t.genres.forEach((g) => {
        counts[g] = (counts[g] || 0) + 1
      }))
      setTopCategories(
        Object.keys(counts)
          .map((g) => ({ x: g, y: counts[g] }))
          .sort((a, b) => b.y - a.y)
      )
    }

    load().catch((err) => console.log(err))
    return () => { cancelled = true }
  }, [accessToken])

  return (
    <Container fluid>
      <Row className="content-wrapper">
        <Col className="playlist-wrapper">
          <div>
            <div className="info-text"><span style={{ fontFamily: 'Staatliches' }}>Top
            <span className="info-text-highlight"> {clickedGenre.genre} </span>Songs</span></div>
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
              <span class="info-text-highlight">{clickedGenre.genre} </span> accounts for
              <span class="info-text-highlight"> {Math.round(clickedGenre.numSongs / totalTopSongs * 100)}% </span> of your top songs
            </div>
            :
            <div className="info-text">
              Discover Your <br></br>
              <span class="info-text-highlight">top genres </span> <br></br>
              on Spotify!
            </div>
          }
        </Col>
      </Row>

      <Navbar className="footer-wrapper" fixed="bottom">
        <p className='footer-text' style={{ color: 'black' }}>Made by incakoala</p>

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

    </Container>
  )
}
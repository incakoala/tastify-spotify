import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Navbar, Dropdown, DropdownButton } from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"
import Player from './Player'
import Playlist from './Playlist'
import Donut from './Donut'
import './Genre.css'

const spotifyApi = new SpotifyWebApi({
  clientId: "b2d89a8ed2a5494196384e30483c4706"
})
export default function Genre({ accessToken, code }) {
  const [topGenres, setTopGenres] = useState([])
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
  }, [accessToken, clickedGenre])


  // Get user's top genres
  useEffect(() => {
    if (!accessToken) return

    const getGenresFromArtists = (artists) => {
      return artists
        .map((artist) => artist)
        .reduce(async (result, a) => {
          const temp = await spotifyApi.getArtist(a.id)

          if (temp) {
            (await result).push(temp.body.genres)
          }
          return await result
        }, [])
    }

    spotifyApi
      // start by getting user's top tracks
      .getMyTopTracks({ limit: 50, time_range: "long_term" })
      // only take the first artist of a track
      .then((data) => {
        return data.body.items.map((track) => {
          return track.artists[0]
        })
      })
      // need to query getArtist endpoint to get genres data
      .then(async (artists) => {
        return await getGenresFromArtists(artists)
      })
      // map genres' occurences
      .then((genres) => {
        return [].concat.apply([], genres)
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
      // transform to {x: genre, y: numSongs} object so that VictoryChart
      // can display the data
      .then((topSongs) => {
        setTotalTopSongs(Object.keys(topSongs).length)
        return Object.keys(topSongs).slice(0, Object.keys(topSongs).length)
          .reduce((result, item) => {
            result.push({
              x: item,
              y: topSongs[item]
            })
            return result
          }, [])
          .sort((a, b) => {
            return (a.y > b.y) ? -1 : (a.y === b.y) ? ((a.y > b.y) ? -1 : 1) : 1
          })
      })
      // set final top genres
      .then((finalTopGenres) => {
        setTopGenres(finalTopGenres)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [topGenres, accessToken])

  // Get user's top tracks from a genre
  const getTopTracksFromGenre = (inputGenre) => {
    const getArtistsData = (artistsAndTracksList) => {
      return artistsAndTracksList
        .map((at) => at)
        .reduce(async (result, a) => {
          const temp = await spotifyApi.getArtist(a.artist.id)

          if (temp) {
            (await result).push({
              artist: temp,
              track: a.track,
              trackUri: a.trackUri,
              trackDuration: a.trackDuration,
              albumUrl: a.albumUrl
            })
          }
          return await result

        }, [])
    }
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
            result.push({
              artist: item.artists[0],
              track: item.name,
              trackUri: item.uri,
              trackDuration: convertDuration(),
              albumUrl: largestAlbumImage.url
            })
            return result
          }, [])
      })
      // need to query getArtist endpoint to get genres data
      .then(async (artistsAndTracksList) => {
        return await getArtistsData(artistsAndTracksList)
      })
      // update genres
      .then((updatedArtistsAndTracksList) => {
        return updatedArtistsAndTracksList
          .map((item) => item)
          .reduce((result, data) => {
            result.push({
              artist: data.artist.body.name,
              genres: data.artist.body.genres,
              track: data.track,
              trackUri: data.trackUri,
              trackDuration: data.trackDuration,
              albumUrl: data.albumUrl
            })
            return result
          }, [])
      })
      // set final playlist
      .then((finalList) => {
        return setCurrPlaylist(
          finalList
            .filter((g) => {
              return g.genres.includes(inputGenre)
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
          <DropdownButton className="view-dropdown"
            title={numberOfItems}
            onSelect={(e) => { setNumberOfItems(e) }}
          >
            <Dropdown.Item eventKey="10">10</Dropdown.Item>
            <Dropdown.Item eventKey="25">25</Dropdown.Item>
            <Dropdown.Item eventKey="50">50</Dropdown.Item>
          </DropdownButton>

          <Donut className="donut"
            topGenres={topGenres}
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
              <span class="info-text-highlight"> {Math.round(clickedGenre.numSongs / 50 * totalTopSongs)}% </span> of your top songs
            </div>
            :
            <div className="info-text">
              Explore Your <br></br>
              <span class="info-text-highlight">top genres </span> <br></br>
              on Spotify!
            </div>
          }
        </Col>
      </Row>

      <Navbar className="footer-wrapper" fixed="bottom">
        <Player
          accessToken={accessToken}
          trackUris={currPlaylist}
          setCurrPlayingTrack={setCurrPlayingTrack}
          currPlayingTrackInfo={currPlayingTrackInfo}
          setCurrPlayingTrackInfo={setCurrPlayingTrackInfo}
          setIsPaused={setIsPaused}
        />
      </Navbar>

    </Container>
  )
}
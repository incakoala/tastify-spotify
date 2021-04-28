import React, { useState, useEffect, Fragment } from 'react'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
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
  const [currPlayingTrack, setCurrPlayingTrack] = useState([])
  const [currPlayingTrackInfo, setCurrPlayingTrackInfo] = useState([])
  const [totalTopSongs, setTotalTopSongs] = useState(0)

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)

  }, [accessToken])

  useEffect(() => {
    if (clickedGenre !== {} || clickedGenre !== "") getTopTracksFromGenre(clickedGenre.genre)

  }, [clickedGenre])

  useEffect(() => {
    if (!accessToken) return

    spotifyApi
      .getMyTopArtists({ limit: 50, time_range: "long_term" })
      .catch((err) => {
        console.log(err)
      })
      .then((data) => {
        return data.body.items.map((artist) => {
          return artist.genres
        })
      })
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
      .then((top) => {
        setTotalTopSongs(Object.keys(top).length)
        return Object.keys(top).slice(0, Object.keys(top).length / 3)
          .reduce((result, g) => {
            result.push({
              x: g,
              y: top[g]
            })
            return result
          }, [])
          .sort((a, b) => {
            return (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.y > b.y) ? 1 : -1) : -1
          })
      })
      .then((a) => {
        setTopGenres(a)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [topGenres, accessToken])

  const getTopTracksFromGenre = (inputGenre) => {
    const getArtistData = (artistsAndTracksList) => {
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
          .reduce((result, t) => {
            const largestAlbumImage = t.album.images.reduce(
              (largest, image) => {
                if (image.height > largest.height) return image
                return largest
              },
              t.album.images[0]
            )
            const convertDuration = () => {
              var minutes = Math.floor(t.duration_ms / 60000);
              var seconds = ((t.duration_ms % 60000) / 1000).toFixed(0);
              return minutes + ":" + (t.duration_ms < 10 ? '0' : '') + seconds;
            }
            result.push({
              artist: t.artists[0],
              track: t.name,
              trackUri: t.uri,
              trackDuration: convertDuration(),
              albumUrl: largestAlbumImage.url
            })
            return result
          }, [])
      })
      .then(async (artistsAndTracksList) => {
        return await getArtistData(artistsAndTracksList)
      })
      .then((updatedArtistsAndTracksList) => {
        console.log(updatedArtistsAndTracksList)
        return updatedArtistsAndTracksList
          .map((item) => item)
          .reduce((result, a) => {
            result.push({
              artist: a.artist.body.name,
              genres: a.artist.body.genres,
              track: a.track,
              trackUri: a.trackUri,
              trackDuration: a.trackDuration,
              albumUrl: a.albumUrl
            })
            return result
          }, [])
      })
      .then((finalList) => {
        return finalList
          // .map((item) => item)
          .filter((g) => {
            return g.genres.includes(inputGenre)
          })
      })
      .then((res) => {
        console.log(res)
        setCurrPlaylist(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Fragment>
      <div className="content-wrapper">
        <Row>
          <Col className="text-wrapper">
            {currPlaylist.length > 0 ?
              <div className="info-text">
                <span class="info-text-highlight">{clickedGenre.genre}</span> accounts for
                <span class="info-text-highlight"> {Math.round(clickedGenre.numSongs / 50 * totalTopSongs)}% </span>
                 of your top songs
              </div>
              : <div className="info-text">Choose a genre from your <span class="info-text-highlight">top genres on Spotify</span>!</div>
            }
          </Col>

          <Col sm={5} className="donut-wrapper">
            {/* {Object.keys(topGenres).map((keyName) => (
                <li>
                  <span>{keyName}: {topGenres[keyName]}</span>
                </li>
              ))} */}

            <Donut className="donut"
              topGenres={topGenres}
              clickedGenre={clickedGenre}
              setClickedGenre={setClickedGenre}
              setCurrPlaylist={setCurrPlaylist}
              currPlayingTrack={currPlayingTrack}
              currPlayingTrackInfo={currPlayingTrackInfo}
            />

          </Col>

          <Col className="playlist-wrapper">
            <div>
              {currPlaylist.length > 0 ?
                <Playlist
                  currPlaylist={currPlaylist}
                  currPlayingTrack={currPlayingTrack}
                />
                :
                <div className="info-text">
                  <span class="info-text-highlight">{clickedGenre.genre}</span> accounts for
                <span class="info-text-highlight"> {Math.round(clickedGenre.numSongs / 50 * totalTopSongs)}% </span>
                 of your top songs
              </div>
              }

            </div>
          </Col>
        </Row>

        {/* <div>
            {currPlaylist.length > 0 ?
              [...Array(3)].map((e, i) => (
                <div>
                  <li>
                    artist: {currPlaylist[i].artist}
                    <br></br>
                  track: {currPlaylist[i].track}
                    <br></br>
                  trackUri: {currPlaylist[i].trackUri}
                    <br></br>
                  albumUrl: {currPlaylist[i].albumUrl}
                  </li>
                </div>
              ))

              : null}
          </div> */}
      </div>


      <Navbar className="footer-wrapper" fixed="bottom">
        <Player
          accessToken={accessToken}
          trackUris={currPlaylist}
          currPlayingTrack={currPlayingTrack}
          setCurrPlayingTrack={setCurrPlayingTrack}
          currPlayingTrackInfo={currPlayingTrackInfo}
          setCurrPlayingTrackInfo={setCurrPlayingTrackInfo}
        />
      </Navbar>

    </Fragment>
  )
}
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Navbar, Dropdown, DropdownButton } from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"
import Player from './Player'
import Playlist from './Playlist'
import Donut from './Donut'
import './Category.css'

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


  // Get user's top genres
  useEffect(() => {
    if (!accessToken) return

    spotifyApi
      // start by getting user's top tracks
      .getMyTopTracks({ limit: 50, time_range: "long_term" })
      // only take the first artist of a track
      .then((data) => {
        // console.log(data.body.items.length)
        setTotalTopSongs(data.body.items.length)

        return data.body.items.map((track) => track.artists)
      })
      .then((artists) => {
        // console.log(artists)
        return [].concat.apply([], artists)
          .map((artist) => artist)
          .reduce((result, item) => {
            // console.log(item)
            result.push(item)
            return result
          }, [])
      })
      .then((artistsObject) => {
        // console.log(artistsObject)
        return artistsObject.map((obj) => {
          // console.log(obj.id)
          return obj.name
        })
      })
      // map genres' occurences
      .then((artistsList) => {
        // console.log(artistsList)
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
      // transform to {x: genre, y: numSongs} object so that VictoryChart
      // can display the data
      .then((topArtists) => {
        // console.log(topArtists)
        // setTotalTopSongs(Object.keys(topArtists).length)
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
      // set final top genres
      .then((finalTopArtists) => {
        // console.log(finalTopArtists)
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
                  // console.log(item.name)
                  result.push(item.name)
                  return result
                }, [])
            }
            // console.log(getArtistsList(item.artists))
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
      // update genres
      // .then((tracksList) => {
      //   return tracksList
      //     .map((item) => item)
      //     .reduce((result, data) => {
      //       result.push({
      //         artist: data.artist.body.name,
      //         genres: data.artist.body.genres,
      //         track: data.track,
      //         trackUri: data.trackUri,
      //         trackDuration: data.trackDuration,
      //         albumUrl: data.albumUrl
      //       })
      //       return result
      //     }, [])
      // })
      // set final playlist
      .then((finalList) => {
        return setCurrPlaylist(
          finalList
            .filter((g) => {
              return g.artists.includes(inputArtist)
            })
        )
      })
      // .then(() => {
      //   console.log(currPlaylist)
      // })
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
              <span class="info-text-highlight">top artists </span> <br></br>
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
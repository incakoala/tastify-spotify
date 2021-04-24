// import React, { useState, useEffect } from 'react'
// import { Container, Row, Col } from 'react-bootstrap'
// import useAuth from '../useAuth'
// import SpotifyWebApi from "spotify-web-api-node"
// import Player from '../Player/Player'
// import Playlist from '../Playlist/Playlist'
// import Donut from '../Donut'
// import './Genre.css'

// const spotifyApi = new SpotifyWebApi({
//   clientId: "b2d89a8ed2a5494196384e30483c4706"
// })
// export default function Genre({ code }) {
//   const accessToken = useAuth(code)

//   const [topGenres, setTopGenres] = useState([])
//   const [clickedGenre, setClickedGenre] = useState({})
//   const [currPlaylist, setCurrPlaylist] = useState([])
//   const [currUris, setCurrUris] = useState([])
//   const [currPlayingTrack, setCurrPlayingTrack] = useState([])
//   const [currPlayingTrackInfo, setCurrPlayingTrackInfo] = useState([])
//   const [displayPlayback, setDisplayPlayback] = useState("")

//   useEffect(() => {
//     if (!accessToken) return
//     spotifyApi.setAccessToken(accessToken)

//   }, [accessToken])

//   useEffect(() => {
//     if (!accessToken) return

//     spotifyApi
//       .getMyTopArtists({ limit: 50, time_range: "long_term" })
//       .catch((err) => {
//         console.log(err)
//       })
//       .then((data) => {
//         return data.body.items.map((artist) => {
//           // console.log(artist.genres)
//           return artist.genres
//         })
//       })
//       .then((genres) => {
//         // console.log(genres)
//         return [].concat.apply([], genres)
//           .reduce((result, item) => {
//             const get = (k) => {
//               return result[k]
//             }
//             if (get(item) === undefined) {
//               result[item] = 1
//             }
//             else if (get(item) !== undefined) {
//               result[item] = result[item] + 1
//             }
//             return result
//           }, {})
//       })
//       .then((a) => {
//         // console.log(a)
//         setTopGenres(a)
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }, [topGenres, accessToken])

//   const getTopTracksFromGenre = (inputGenre) => {
//     const getArtistData = (artistsAndTracksList) => {
//       return artistsAndTracksList
//         .map((at) => at)
//         .reduce(async (result, a) => {
//           const temp = await spotifyApi.getArtist(a.artist.id)

//           if (temp) {
//             (await result).push({
//               artist: temp,
//               track: a.track,
//               trackUri: a.trackUri,
//               trackDuration: a.trackDuration,
//               albumUrl: a.albumUrl
//             })
//           }
//           return await result

//         }, [])
//     }
//     spotifyApi
//       .getMyTopTracks({ limit: 50, time_range: "long_term" })
//       .then((data) => {
//         // console.log(data.body.items)
//         return data.body.items
//           .map((track) => track)
//           .reduce((result, t) => {
//             const largestAlbumImage = t.album.images.reduce(
//               (largest, image) => {
//                 if (image.height > largest.height) return image
//                 return largest
//               },
//               t.album.images[0]
//             )
//             const convertDuration = () => {
//               var minutes = Math.floor(t.duration_ms / 60000);
//               var seconds = ((t.duration_ms % 60000) / 1000).toFixed(0);
//               return minutes + ":" + (t.duration_ms < 10 ? '0' : '') + seconds;
//             }
//             result.push({
//               artist: t.artists[0],
//               track: t.name,
//               trackUri: t.uri,
//               trackDuration: convertDuration(),
//               albumUrl: largestAlbumImage.url
//             })
//             return result
//           }, [])
//       })
//       .then(async (artistsAndTracksList) => {
//         return await getArtistData(artistsAndTracksList)
//       })
//       .then((updatedArtistsAndTracksList) => {
//         console.log(updatedArtistsAndTracksList)
//         return updatedArtistsAndTracksList
//           .map((item) => item)
//           .reduce((result, a) => {
//             result.push({
//               artist: a.artist.body.name,
//               genres: a.artist.body.genres,
//               track: a.track,
//               trackUri: a.trackUri,
//               trackDuration: a.trackDuration,
//               albumUrl: a.albumUrl
//             })
//             return result
//           }, [])
//       })
//       .then((finalList) => {
//         return finalList
//           // .map((item) => item)
//           .filter((g) => {
//             return g.genres.includes(inputGenre)
//           })
//       })
//       .then((res) => {
//         const flattenedUris = res.flatMap(
//           (elem) => elem.trackUri
//         )
//         const flattenedTracks = res.flatMap(
//           (elem) => elem.track
//         )
//         // console.log(res.track)
//         setCurrPlaylist(res)
//         setCurrUris(flattenedUris)
//         // return {
//         //   playlist: ret,
//         //   urisList: flattenedUris
//         // }
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }

//   const clickAGenre = (genre) => {
//     setClickedGenre(genre)
//     getTopTracksFromGenre(genre)
//   }

//   return (
//     <Container>

//       <a className="btn btn-success btn-lg" onClick={() => clickAGenre("k-pop")}>K-Pop</a>

//       {clickedGenre === {} ? (
//         <>
//           <Donut
//             topGenres={topGenres}
//             clickedGenre={clickedGenre}
//             setClickedGenre={setClickedGenre}
//           />

//         </>
//       ) : (
//         <div>
//           <Row>
//             <Col>
//               etc
//             </Col>

//             <Col xs={5}>


//             </Col>

//             <Col>
//               <div>
//                 <Playlist
//                   currPlaylist={currPlaylist}
//                   currPlayingTrack={currPlayingTrack}
//                 />
//               </div>
//             </Col>
//           </Row>

//         </div>
//       )}


//       <Player
//         accessToken={accessToken}
//         trackUris={currPlaylist}
//         currPlayingTrack={currPlayingTrack}
//         setCurrPlayingTrack={setCurrPlayingTrack}
//         currPlayingTrackInfo={currPlayingTrackInfo}
//         setCurrPlayingTrackInfo={setCurrPlayingTrackInfo}
//       />

//     </Container>
//   )
// }




import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import useAuth from '../useAuth'
import SpotifyWebApi from "spotify-web-api-node"
import Player from '../Player/Player'
import Playlist from '../Playlist/Playlist'
import Donut from '../Donut'
import './Genre.css'

const spotifyApi = new SpotifyWebApi({
  clientId: "b2d89a8ed2a5494196384e30483c4706"
})
export default function Genre({ code }) {
  const accessToken = useAuth(code)

  const [topGenres, setTopGenres] = useState([])
  const [clickedGenre, setClickedGenre] = useState({})
  const [currPlaylist, setCurrPlaylist] = useState([])
  const [currUris, setCurrUris] = useState([])
  const [currPlayingTrack, setCurrPlayingTrack] = useState([])
  const [currPlayingTrackInfo, setCurrPlayingTrackInfo] = useState([])
  const [displayPlayback, setDisplayPlayback] = useState("")

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)

  }, [accessToken])

  useEffect(() => {
    if (clickedGenre !== {}) getTopTracksFromGenre(clickedGenre.genre)
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
          // console.log(artist.genres)
          return artist.genres
        })
      })
      .then((genres) => {
        // console.log(genres)
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
      // .then((gg) => {
      //   gg.sort((a, b) => 
      //   (a.color > b.color) ? 1 : (a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 )
      // })
      .then((a) => {
        // console.log(a)
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
        // console.log(data.body.items)
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
        // console.log(updatedArtistsAndTracksList)
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
        const flattenedUris = res.flatMap(
          (elem) => elem.trackUri
        )
        const flattenedTracks = res.flatMap(
          (elem) => elem.track
        )
        // console.log(res.track)
        setCurrPlaylist(res)
        setCurrUris(flattenedUris)
        // return {
        //   playlist: ret,
        //   urisList: flattenedUris
        // }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // const clickAGenre = (genre) => {
  //   setClickedGenre(genre)
  //   getTopTracksFromGenre(genre)
  // }

  return (
    <Container>

      {/* <a className="btn btn-success btn-lg" onClick={() => clickAGenre("k-pop")}>K-Pop</a> */}
      {clickedGenre === {} ? (
        <>

          <Donut
            topGenres={topGenres}
            setClickedGenre={setClickedGenre}
            setCurrPlaylist={setCurrPlaylist}
            setCurrUris={setCurrUris}
          />


        </>
      ) : (
        <div>
          {/* {getTopTracksFromGenre(clickedGenre.genre)} */}
          <Row>
            <Col>
              {clickedGenre.genre}
            </Col>

            <Col xs={5}>
              {/* <img src={currPlayingTrackInfo.albumUrl} /> */}

              {/* {Object.keys(topGenres).map((keyName) => (
                <li>
                  <span>{keyName}: {topGenres[keyName]}</span>
                </li>
              ))} */}

              <Donut
                topGenres={topGenres}
                setClickedGenre={setClickedGenre}
                setCurrPlaylist={setCurrPlaylist}
                setCurrUris={setCurrUris}
              />

            </Col>

            <Col>
              <div>
                <Playlist
                  currPlaylist={currPlaylist}
                  currPlayingTrack={currPlayingTrack}
                />
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
      )}


      <Player
        accessToken={accessToken}
        trackUris={currPlaylist}
        currPlayingTrack={currPlayingTrack}
        setCurrPlayingTrack={setCurrPlayingTrack}
        currPlayingTrackInfo={currPlayingTrackInfo}
        setCurrPlayingTrackInfo={setCurrPlayingTrackInfo}
      />

    </Container>
  )
}
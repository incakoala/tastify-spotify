import React, { useState, useEffect } from 'react'
import SpotifyPlayer from "react-spotify-web-playback"
import './Player.css'

export default function Player({
  accessToken,
  trackUris,
  currPlayingTrack,
  setCurrPlayingTrack,
  setCurrPlayingTrackInfo
}) {
  // const [play, setPlay] = useState(false)

  // useEffect(() => setPlay(true), [trackUri])

  const flattenedUris = (uris) => uris.flatMap(
    (elem) => elem.trackUri
  )

  const setTrackInfo = (uri, playlist) => {
    const temp = [...Array(playlist.length)]
    let res = {}
    temp.map((e, i) => {
      if (playlist[i].trackUri === uri) {
        res = playlist[i]
      }
      return true
    })
    // console.log(res)
    setCurrPlayingTrackInfo(res)
  }

  if (!accessToken) return null
  return (
    <>
    {/* {currPlayingTrack} */}
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={state => {
          if (state.isPlaying) {
            setCurrPlayingTrack(state.track.uri)
            setTrackInfo(state.track.uri, trackUris)
          }
          if (!state.isPlaying) {
            setCurrPlayingTrack([])
          }
        }}
        // callback={state => { if (!state.isPlaying) setPlay(false) }}
        // play={true}
        uris={trackUris ? flattenedUris(trackUris) : []}
        styles={{
          activeColor: '#AF7C40',
          bgColor: '#000000',
          color: '#AF7C40',
          loaderColor: '#fff',
          sliderColor: '#000000',
          sliderTrackColor: '000000',
          sliderHandleColor: '000000',
          trackArtistColor: '#ccc',
          trackNameColor: '#fff',
        }}
      />
    </>
  )
}





// import React, { useState, useEffect } from 'react'
// // import SpotifyPlayer from "react-spotify-web-playback"
// import SpotifyWebApi from "spotify-web-api-node"
// import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
// import './Player.css'
// import axios from 'axios'

// const spotifyApi = new SpotifyWebApi({
//   clientId: "b2d89a8ed2a5494196384e30483c4706"
// })
// export default function Player({ accessToken, trackUri }) {
//   const [play, setPlay] = useState(true)

//   useEffect(() => {
//     // setPlay(true)
//     // (!isPlaying()) ? setPlay(false) : setPlay(true)
//     console.log(accessToken)
//     if (play) playerAction('play', accessToken, trackUri)
//   }, [play, accessToken, trackUri])

//   const playerAction = (action, token, uri) => {
//     var method;
//     var params = {};
//     var data = {};
//     switch (action) {
//       case "next":
//         method = "post";
//         break;
//       case "previous":
//         method = "post";
//         break;
//       case "play":
//         method = "put";
//         if (uri) data = { uris: [uri] };
//         break;
//       default:
//         method = "put";
//     }
//     return axios({
//       method: method,
//       url: `https://api.spotify.com/v1/me/player/${action}`,
//       params: params,
//       data: data,
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });


//     // axios.put('https://api.spotify.com/v1/me/player/play',
//     //   {
//     //     data: {
//     //       uris: [uri]
//     //     }
//     //   },
//     //   {
//     //     headers: {
//     //       Accept: 'application/json',
//     //       'Content-Type': 'application/json',
//     //       Authorization: `Bearer ${accessToken}`,
//     //     }
//     //   }
//     // )
//     //   .then(res => {
//     //     console.log(res)
//     //   })
//     //   .catch((err) => {
//     //     console.log(err)
//     //   })
//   }

//   const isPlaying = () => {
//     return spotifyApi.getMyCurrentPlaybackState()
//       .then((data) => {
//         if (data.body && data.body.is_playing) {
//           return true
//         } else {
//           return false
//         }
//       }, (err) => {
//         console.log('Something went wrong!', err);
//       });
//   }

//   if (!accessToken) return null
//   return (
//     // <SpotifyPlayer
//     //   token={accessToken}
//     //   showSaveIcon
//     //   callback={state => { if(!state.isPlaying) setPlay(false) }}
//     //   play={play}
//     //   uris={trackUri ? [trackUri] : []}
//     // />

//     <div>
//       {/* {(!isPlaying()) ? setPlay(false) : setPlay(true)} */}

//       {/* { play ? playerAction('play', accessToken, trackUri) : setPlay(false)} */}


//       <PlayArrowRoundedIcon
//         // onClick={() => playerAction('play', accessToken, trackUri)}
//         style={{ color: "AF7C40", fontSize: 100 }}
//       />
//     </div>
//   )
// }


import React from 'react'
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({
  accessToken,
  trackUris,
  setCurrPlayingTrack,
  setCurrPlayingTrackInfo,
  setIsPaused
}) {
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
    setCurrPlayingTrackInfo(res)
  }

  if (!accessToken) return null
  return (
    <>
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={state => {
          if (state.isPlaying) {
            setIsPaused(false)
            setCurrPlayingTrack(state.track.uri)
            setTrackInfo(state.track.uri, trackUris)
          }
          if (!state.isPlaying && state.progressMs === 0) {
            setIsPaused(false)
            setCurrPlayingTrack([])
            setTrackInfo('', [])

          }
          if (!state.isPlaying && state.progressMs !== 0) {
            setIsPaused(true)
          }
        }}
        uris={trackUris ? flattenedUris(trackUris) : []}
        styles={{
          height: 70,
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

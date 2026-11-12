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

  // Find the playing track in the playlist to get its large album artwork.
  // Spotify can play a regional substitute with a different URI ("track
  // relinking"), so fall back to matching by name, then to the player's own
  // (smaller) artwork, so the record never shows up blank.
  const setTrackInfo = (track, playlist) => {
    if (!track) {
      setCurrPlayingTrackInfo({})
      return
    }
    const match =
      playlist.find((t) => t.trackUri === track.uri) ||
      playlist.find((t) => t.track === track.name)
    setCurrPlayingTrackInfo({
      ...match,
      albumUrl: (match && match.albumUrl) || track.image
    })
  }

  if (!accessToken) return null
  return (
    <>
      <SpotifyPlayer
        token={accessToken}
        persistDeviceSelection
        showSaveIcon
        callback={state => {
          if (state.isPlaying) {
            setIsPaused(false)
            setCurrPlayingTrack(state.track.uri)
            setTrackInfo(state.track, trackUris || [])
          }
          if (!state.isPlaying && state.progressMs === 0) {
            setIsPaused(false)
            setCurrPlayingTrack([])
            setTrackInfo(null, [])

          }
          if (!state.isPlaying && state.progressMs !== 0) {
            setIsPaused(true)
          }
        }}
        uris={trackUris ? flattenedUris(trackUris) : []}
        styles={{
          height: 50,
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

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Navbar, Dropdown, DropdownButton } from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"
import Radar from './Radar'

const spotifyApi = new SpotifyWebApi({
  clientId: "b2d89a8ed2a5494196384e30483c4706"
})
export default function AudioFeature({ accessToken, code }) {
  const [topTracks, setTopTracks] = useState([])
  const [audioFeatures, setAudioFeatures] = useState({})

  useEffect(() => {
    if (!accessToken) return

    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return

    if (topTracks !== []) getAudioFeaturesFromTracks(topTracks)
  }, [topTracks, accessToken])

  useEffect(() => {
    if (!accessToken) return

    spotifyApi
      .getMyTopTracks({ limit: 50, time_range: "long_term" })
      .then((data) => {
        return data.body.items.map((track) => track.id)
      })
      .then((trackIds) => {
        // console.log(trackIds)
        setTopTracks(trackIds)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [accessToken])

  const getAudioFeaturesFromTracks = (inputTracks) => {
    spotifyApi
      .getAudioFeaturesForTracks(inputTracks)
      .then((data) => {
        // console.log(data.body)
        return data.body.audio_features
          .map((track) => track)
          .reduce((result, item) => {
            // console.log(item.danceability)
            // console.log(result['danceability'])
            // console.log(item)
            result['danceability'] += (item !== null ? item.danceability : 0.0)
            result['energy'] += (item !== null ? item.energy : 0.0)
            result['speechiness'] += (item !== null ? item.speechiness : 0.0)
            result['acousticness'] += (item !== null ? item.acousticness : 0.0)
            result['instrumentalness'] += (item !== null ? item.instrumentalness : 0.0)
            result['liveness'] += (item !== null ? item.liveness : 0.0)
            result['valence'] += (item !== null ? item.valence : 0.0)
            return result
          }, {
            danceability: 0.0,
            energy: 0.0,
            speechiness: 0.0,
            acousticness: 0.0,
            instrumentalness: 0.0,
            liveness: 0.0,
            valence: 0.0
          })
      })
      .then((allFeatures) => {
        // console.log(allFeatures)
        return Object.keys(allFeatures).slice(0, Object.keys(allFeatures).length)
          .reduce((result, item) => {
            result.push({
              x: item,
              y: allFeatures[item]
            })
            return result
          }, [])
          .sort((a, b) => {
            return (a.y > b.y) ? -1 : (a.y === b.y) ? ((a.y > b.y) ? -1 : 1) : 1
          })
      })
      .then((res) => {
        // console.log(res)
        setAudioFeatures(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          blah
        </Col>

        <Col xl={{ span: 8 }}>
          {audioFeatures.length > 0 ?
            <Radar audioFeatures={audioFeatures} />
            :
            <> </>
          }
        </Col>
      </Row>
    </Container>
  )
}

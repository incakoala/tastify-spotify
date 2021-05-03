import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Nav, Navbar } from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"
import './AudioFeature.css'
import Radar from './Radar'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID
})
export default function AudioFeature({ accessToken }) {
  const [topTracks, setTopTracks] = useState([])
  const [audioFeatures, setAudioFeatures] = useState({})
  const [timeRange, setTimeRange] = useState('long_term')

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
      .getMyTopTracks({ limit: 50, time_range: timeRange })
      .then((data) => {
        return data.body.items.map((track) => track.id)
      })
      .then((trackIds) => {
        setTopTracks(trackIds)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [timeRange, accessToken])

  const getAudioFeaturesFromTracks = (inputTracks) => {
    spotifyApi
      .getAudioFeaturesForTracks(inputTracks)
      .then((data) => {
        return data.body.audio_features
          .map((track) => track)
          .reduce((result, item) => {
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
        setAudioFeatures(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Container fluid>
      <Row className="audio-content-wrapper">
        <Col xl={{ span: 3, order: "first" }} lg={{ order: "last" }} md={{ order: "last" }} sm={{ order: "last" }} xs={{ order: "last" }} >
          <Card>
            <Card>
              <Card.Body>
                <Card.Title>Valence</Card.Title>
                <Card.Text>
                  The musical positiveness conveyed by a track
                </Card.Text>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>Acousticness</Card.Title>
                <Card.Text>
                  The likelihood that a track is acoustic
                </Card.Text>
              </Card.Body>
            </Card>

            <Card.Body>
              <Card.Title>Liveness</Card.Title>
              <Card.Text>
                THe presence of an audience in the recording (e.g. the track was performed live)
                </Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Speechiness</Card.Title>
              <Card.Text>
                The presence of spoken words there may be in a track. Tracks that are made entirely of spoken words score the highest, while those contain both music and speech (e.g. rap music) lie in the middle
                </Card.Text>
            </Card.Body>
          </Card>

          <span style={{ color: '#cbcbcb', textDecoration: 'underline' }}>Credit: Spotify</span>
        </Col>

        <Col xl={{ span: 5 }} className="radar-wrapper">
          <Nav justify variant="tabs" defaultActiveKey="long_term">
            <Nav.Item className="tab">
              <Nav.Link
                className="tab-item"
                eventKey="long_term"
                onClick={() => {
                  setTimeRange("long_term")
                }}
              >
                All-Time
                </Nav.Link>
            </Nav.Item>

            <Nav.Item className="tab">
              <Nav.Link
                className="tab-item"
                eventKey="medium_term"
                onClick={() => {
                  setTimeRange("medium_term")
                }}
              >
                6 months
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="tab">
              <Nav.Link
                className="tab-item"
                eventKey="short_term"
                onClick={() => {
                  setTimeRange("short_term")
                }}
              >
                4 weeks
                </Nav.Link>
            </Nav.Item>
          </Nav>

          {audioFeatures.length > 0 ?
            <Radar audioFeatures={audioFeatures} topTracks={topTracks} />
            :
            <> </>
          }
        </Col>

        <Col xl={{ span: 3 }} >
          <Card>
            <Card.Body>
              <Card.Title>Danceability</Card.Title>
              <Card.Text>
                How suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity
                </Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Energy</Card.Title>
              <Card.Text>
                Perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale
                </Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Instrumentalness</Card.Title>
              <Card.Text>
                Whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Navbar className="footer-wrapper" fixed="bottom">
        <div style={{ marginLeft: 'auto', marginRight: '0', height: '50px' }} >
          <a className='footer-text' href="https://github.com/incakoala">Made by incakoala</a>
        </div>
      </Navbar>
    </Container >
  )
}

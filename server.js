const port = process.env.PORT || 3001
const path = require("path")
require('dotenv').config()
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "client", "build")))

var DEV = process.env.DEV ? true : false;
var redirect_uri = DEV ? 'http://localhost:3000' : 'https://tastify-spotify.herokuapp.com'

app.post('/login', (req, res) => {
  const code = req.body.code

  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
      })
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken
  })

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn
      })
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port)
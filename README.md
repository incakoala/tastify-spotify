# Tastify 🎸🤘🎼🎵
**A music taste discovery tool built with the [Spotify APIs](https://developer.spotify.com/discover/)**

<br>

**[Live Website](https://tastify-spotify-74b017a66560.herokuapp.com/)**

<br>

At the minimum, you must have a Spotify account with a listening history to view the data points. To utilize all of the features, [Spotify Premium](https://www.spotify.com/us/premium/) and a [supported browser](https://developer.spotify.com/documentation/web-playback-sdk/#supported-browsers) are required.

<br>

![gif](https://res.cloudinary.com/devjzx2qq/image/upload/v1619825992/ezgif.com-gif-maker_ugp68v.gif)

## Setup
[Follow the authorization guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/) to set up a new app and obtain Spotify client information.

Start the backend server
```
1. npm install
2. npm run devStart
```

Start the React client
```
1. cd client
2. npm install
3. npm start
```

Once both servers are started, open the app at http://127.0.0.1:3000/ (not `localhost`). Spotify only accepts insecure `http` redirect URIs for loopback IP addresses, so add `http://127.0.0.1:3000` as a Redirect URI in your Spotify app.

## Deploying to Netlify
The repo includes a `netlify.toml`. The React client is deployed as a static site, and the Express `/login` and `/refresh` routes run as Netlify Functions (`netlify/functions/`).

1. In Netlify, choose **Add new site → Import an existing project** and select this repo. The build settings are read from `netlify.toml`.
2. Under **Site configuration → Environment variables**, add `CLIENT_ID` and `CLIENT_SECRET` from your Spotify app.
3. Deploy. Then, in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), add your Netlify URL (e.g. `https://your-site.netlify.app`) as a **Redirect URI**.

If you use a custom domain, set `REDIRECT_URI` to that domain (e.g. `https://tastify.example.com`) and add it to the Spotify dashboard too.

Or deploy from the command line:
```
npm install -g netlify-cli
netlify login
netlify init
netlify env:set CLIENT_ID <your-client-id>
netlify env:set CLIENT_SECRET <your-client-secret>
netlify deploy --prod
```

## Tech Stack
* Spotify Web API (+ [wrapper](https://github.com/thelinmichael/spotify-web-api-node))
* Spotify Web Playback SDK (+ [player](https://github.com/gilbarbara/react-spotify-web-playback))
* React
* Node
* Express
* Victory/D3.js

![webapi](https://res.cloudinary.com/devjzx2qq/image/upload/v1619890447/Web_API_endpoints_o4mcam.png)

## Screenshots
![screenshot1](https://res.cloudinary.com/devjzx2qq/image/upload/v1619825281/Screen_Shot_2021-04-30_at_4.25.05_PM_vhvbva.png)
![screenshot2](https://res.cloudinary.com/devjzx2qq/image/upload/v1619825281/Screen_Shot_2021-04-30_at_4.26.02_PM_gvjpao.png)

<br>

Homepage background image © vexels.com

**© 2021 [incakoala](https://github.com/incakoala)**

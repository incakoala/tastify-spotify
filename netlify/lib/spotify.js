// Shared helper: exchange a grant with Spotify's token endpoint.
// Uses the global fetch available in the Netlify Functions runtime (Node 18+).
const TOKEN_URL = 'https://accounts.spotify.com/api/token'

function redirectUri() {
  // REDIRECT_URI overrides; otherwise Netlify's URL (the site's primary URL).
  return process.env.REDIRECT_URI || process.env.URL || 'http://127.0.0.1:3000'
}

async function requestToken(params) {
  const auth = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(params)
  })
  if (!res.ok) throw new Error(`Spotify token request failed: ${res.status}`)
  return res.json()
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}

module.exports = { redirectUri, requestToken, json }

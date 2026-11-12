const { redirectUri, requestToken, json } = require('../lib/spotify')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })
  try {
    const { code } = JSON.parse(event.body || '{}')
    const data = await requestToken({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri()
    })
    return json(200, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    })
  } catch (err) {
    return json(400, { error: 'Login failed' })
  }
}

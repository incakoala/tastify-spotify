const { requestToken, json } = require('../lib/spotify')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })
  try {
    const { refreshToken } = JSON.parse(event.body || '{}')
    const data = await requestToken({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
    return json(200, {
      accessToken: data.access_token,
      expiresIn: data.expires_in
    })
  } catch (err) {
    return json(400, { error: 'Refresh failed' })
  }
}

import { useState, useEffect } from 'react'
import axios from 'axios'
export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()

  useEffect(() => {
    axios.post('/login', {
      code
    })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, null, '/')
      })
      .catch((err) => {
        console.log(err)
        // window.location = '/'
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    // Refresh token every {expiresIn} seconds
    const interval = setInterval(() => {
      axios.post('/refresh', {
        refreshToken
      })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        })
        .catch(() => {
          window.location = '/'
        })
    }, (expiresIn - 60) * 1000)
    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}

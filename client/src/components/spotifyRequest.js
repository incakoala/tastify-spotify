// Helpers for calling the Spotify Web API without tripping its rate limit.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Retry a spotify-web-api-node call when Spotify answers 429 (rate limited),
// waiting as long as its Retry-After header asks.
export async function withRetry(fn, attempts = 4) {
  for (let i = 0; ; i++) {
    try {
      return await fn()
    } catch (err) {
      if (err.statusCode !== 429 || i >= attempts - 1) throw err
      const retryAfter = Number(err.headers && err.headers['retry-after'])
      await sleep((retryAfter > 0 ? retryAfter : 2 ** i) * 1000)
    }
  }
}

// Run fn over items with at most `limit` requests in flight at once.
export async function mapWithConcurrency(items, limit, fn) {
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const item = items[next++]
      await fn(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
}

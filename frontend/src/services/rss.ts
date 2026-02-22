export interface RssFeedItem {
  title: string
  link: string
  description: string
  pubDate: string
  image?: string
}

export interface RssFeedData {
  title: string
  description: string
  link: string
  items: RssFeedItem[]
  lastFetched: number
}

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
]

async function fetchDirect (url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.text()
}

async function fetchWithProxy (url: string, proxyIndex = 0): Promise<string> {
  if (proxyIndex >= CORS_PROXIES.length) {
    throw new Error('All CORS proxies failed')
  }

  const proxyUrl = CORS_PROXIES[proxyIndex] + encodeURIComponent(url)

  try {
    const response = await fetch(proxyUrl, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.text()
  } catch {
    console.warn(`Proxy ${proxyIndex} failed, trying next...`)
    return fetchWithProxy(url, proxyIndex + 1)
  }
}

export interface FetchResult {
  data: RssFeedData
  usedProxy: boolean
}

export async function fetchRssFeed (feedUrl: string, useProxy?: boolean): Promise<FetchResult> {
  if (useProxy) {
    const xmlText = await fetchWithProxy(feedUrl)
    return { data: parseRssFeed(xmlText), usedProxy: true }
  }

  try {
    const xmlText = await fetchDirect(feedUrl)
    return { data: parseRssFeed(xmlText), usedProxy: false }
  } catch {
    console.warn('Direct fetch failed, trying proxies...')
    const xmlText = await fetchWithProxy(feedUrl)
    return { data: parseRssFeed(xmlText), usedProxy: true }
  }
}

export function mergeItems (existing: RssFeedItem[], incoming: RssFeedItem[]): RssFeedItem[] {
  const byLink = new Map<string, RssFeedItem>()

  for (const item of existing) {
    if (item.link) byLink.set(item.link, item)
  }

  for (const item of incoming) {
    if (item.link) byLink.set(item.link, item)
  }

  return Array.from(byLink.values())
    .sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0
      return db - da
    })
}

function parseRssFeed (xmlText: string): RssFeedData {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'text/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('Invalid RSS feed format')
  }

  const isAtom = doc.querySelector('feed') !== null

  if (isAtom) {
    return parseAtomFeed(doc)
  }

  return parseRss2Feed(doc)
}

function extractImage (item: Element, description: string): string | undefined {
  // Try media:content or media:thumbnail (namespace-aware)
  const mediaContent = item.getElementsByTagName('media:content')[0] ||
                       item.getElementsByTagName('media:thumbnail')[0]
  if (mediaContent) {
    const url = mediaContent.getAttribute('url')
    if (url) return url
  }

  // Try enclosure with image type
  const enclosure = item.querySelector('enclosure[type^="image"]')
  if (enclosure) {
    const url = enclosure.getAttribute('url')
    if (url) return url
  }

  // Try to find image in description/content HTML
  const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/)
  if (imgMatch) return imgMatch[1]

  return undefined
}

function parseRss2Feed (doc: Document): RssFeedData {
  const channel = doc.querySelector('channel')
  if (!channel) throw new Error('Invalid RSS feed: no channel element')

  const items = Array.from(channel.querySelectorAll('item')).map((item) => {
    const description = item.querySelector('description')?.textContent ?? ''
    return {
      title: item.querySelector('title')?.textContent ?? '',
      link: item.querySelector('link')?.textContent ?? '',
      description,
      pubDate: item.querySelector('pubDate')?.textContent ?? '',
      image: extractImage(item, description)
    }
  })

  return {
    title: channel.querySelector('title')?.textContent ?? '',
    description: channel.querySelector('description')?.textContent ?? '',
    link: channel.querySelector('link')?.textContent ?? '',
    items,
    lastFetched: Date.now()
  }
}

function parseAtomFeed (doc: Document): RssFeedData {
  const feed = doc.querySelector('feed')
  if (!feed) throw new Error('Invalid Atom feed')

  const items = Array.from(feed.querySelectorAll('entry')).map((entry) => {
    const description = entry.querySelector('summary')?.textContent ??
                        entry.querySelector('content')?.textContent ?? ''
    return {
      title: entry.querySelector('title')?.textContent ?? '',
      link: entry.querySelector('link')?.getAttribute('href') ?? '',
      description,
      pubDate: entry.querySelector('updated')?.textContent ?? '',
      image: extractImage(entry, description)
    }
  })

  return {
    title: feed.querySelector('title')?.textContent ?? '',
    description: feed.querySelector('subtitle')?.textContent ?? '',
    link: feed.querySelector('link')?.getAttribute('href') ?? '',
    items,
    lastFetched: Date.now()
  }
}

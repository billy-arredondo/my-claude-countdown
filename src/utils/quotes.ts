const ZEN_URL = 'https://zenquotes.io/api/random'
const PROXY = 'https://corsproxy.io/?url='

export async function fetchRandomQuote(signal?: AbortSignal): Promise<{ quote: string; author: string }> {
  const res = await fetch(PROXY + encodeURIComponent(ZEN_URL), { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const arr = await res.json() as Array<{ q: string; a: string }>
  if (!arr?.[0]?.q) throw new Error('Bad payload')
  return { quote: arr[0].q, author: arr[0].a ?? '' }
}

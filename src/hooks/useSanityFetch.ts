import {useEffect, useState} from 'react'

export function useSanityFetch<T>(fetcher: () => Promise<T>, fallback: T): T {
  const [data, setData] = useState<T>(fallback)

  useEffect(() => {
    let cancelled = false
    fetcher().then((result) => {
      if (!cancelled) setData(result)
    })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return data
}

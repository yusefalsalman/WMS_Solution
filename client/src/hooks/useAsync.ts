import { useEffect, useReducer, useState } from 'react'
import { errorMessage } from '../lib/errors'

// A changed loader or refresh starts a new read. Old responses cannot overwrite it.
export function useAsync<T>(load: () => Promise<T>) {
  const [version, refresh] = useReducer((value: number) => value + 1, 0)
  const [result, setResult] = useState<{ load: typeof load; version: number; data?: T; error?: string }>()

  useEffect(() => {
    let active = true
    load().then(
      data => { if (active) setResult({ load, version, data }) },
      error => { if (active) setResult({ load, version, error: errorMessage(error) }) },
    )
    return () => { active = false }
  }, [load, version])

  const loading = result?.load !== load || result?.version !== version
  return { loading, data: loading ? undefined : result?.data, error: loading ? undefined : result?.error, refresh }
}

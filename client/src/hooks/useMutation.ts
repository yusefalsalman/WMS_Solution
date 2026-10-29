import { useRef, useState } from 'react'
import { errorMessage } from '../lib/errors'

export function useMutation() {
  const lock = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()

  async function run(action: () => Promise<unknown>, onSuccess: () => void) {
    if (lock.current) return
    lock.current = true
    setPending(true)
    setError(undefined)
    try {
      await action()
      onSuccess()
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      lock.current = false
      setPending(false)
    }
  }
  return { pending, error, run }
}

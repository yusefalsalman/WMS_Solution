import { isAxiosError } from 'axios'

export function errorMessage(error: unknown): string {
  if (!isAxiosError(error)) return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  if (!error.response) return 'Cannot reach the server. Check your connection and try again.'
  if (error.response.status === 401) return 'Your session has expired. Please sign in again.'
  if (error.response.status === 403) return 'Your role does not have permission to perform this action.'
  const data: unknown = error.response.data
  if (data && typeof data === 'object') {
    if ('errors' in data && data.errors && typeof data.errors === 'object') {
      const messages = Object.values(data.errors).flat().filter((value): value is string => typeof value === 'string')
      if (messages.length) return messages.join(' ')
    }
    if ('title' in data && typeof data.title === 'string') return data.title
  }
  if (error.response.status === 404) return 'This record is no longer available. Refresh the list and try again.'
  if (error.response.status === 409) return 'This change conflicts with existing data. Refresh and try again.'
  return 'The request could not be completed. Please try again.'
}

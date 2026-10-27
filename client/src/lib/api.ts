import axios from "axios";
import { readSession } from './authStorage'


export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
})

let accessToken: string | null = readSession()?.token ?? null

export function setAccessToken(token: string | null) {
  accessToken = token
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config;
})


export function registerUnauthorizedHandler(onUnauthorized: () => void) {
  const interceptorId = api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        error.config?.url !== '/auth/login' &&
        accessToken !== null &&
        error.config?.headers.Authorization === `Bearer ${accessToken}`
      ) {
        onUnauthorized()
      }

      return Promise.reject(error)
    }
  )

  return () => {
    api.interceptors.response.eject(interceptorId)
  }
}
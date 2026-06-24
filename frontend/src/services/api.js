import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api',
})

export function getFileUrl(path) {
  if (!path) {
    return ''
  }

  if (path.startsWith('http')) {
    return path
  }

  const apiBaseUrl = api.defaults.baseURL.replace('/api', '')
  return `${apiBaseUrl}${path}`
}
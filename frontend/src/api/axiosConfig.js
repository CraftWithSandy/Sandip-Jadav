import axios from 'axios'

// Share one API client across all screens.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

export default api

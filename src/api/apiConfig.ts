import axios from 'axios'

// ============ API Configuration ============
const API_BASE_URL = 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

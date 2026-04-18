// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://t1dcaregiverapp.onrender.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: __DEV__ ? 'http://10.0.2.2:3000/' : 'https://t1dcaregiverapp.onrender.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
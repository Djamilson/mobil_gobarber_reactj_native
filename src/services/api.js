import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.0.125:3000',
  baseURL: 'http://138.197.79.44',
});

export default api;

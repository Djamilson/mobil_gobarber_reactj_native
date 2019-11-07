import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.0.125:3000',
  baseURL: 'http://45.55.40.225',
});

export default api;

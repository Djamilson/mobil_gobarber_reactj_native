import axios from 'axios';
import localhostConfig from '../config/host';

const api = axios.create({
  // baseURL: `http://${localhostConfig.LOCALHOST}:3000`,
  baseURL: `http://${localhostConfig.WEBHOST}:${localhostConfig.PORT}`,
});

export default api;

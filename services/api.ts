import axios from 'axios';
import environment from '../environment';

const api = axios.create({
  baseURL: environment.apiUrl, // change to your backend URL
  timeout: 5000,
});

export default api;
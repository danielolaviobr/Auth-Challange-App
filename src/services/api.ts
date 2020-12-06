import axios from 'axios';

// Centralized API connection using axios

const api = axios.create({
  baseURL: 'https://backoffice.intouchbiz.com/',
  timeout: 3000,
});

export default api;

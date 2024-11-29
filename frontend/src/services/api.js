import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export const processYouTubeUrl = async (url) => {
  try {
    const response = await api.post('/process', { url });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 
      error.response?.data?.error || 
      'Failed to process video'
    );
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API health check failed');
  }
};

export default api; 
import axios from 'axios';

// Use relative API path to leverage Vite dev server proxy or same-host deployment
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  checkHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return res.data;
    } catch (err) {
      // Fallback direct port check if proxy isn't routing
      const direct = await axios.get('http://127.0.0.1:5000/api/health', { timeout: 3000 });
      return direct.data;
    }
  },

  getStats: async () => {
    try {
      const res = await apiClient.get('/stats');
      return res.data;
    } catch (err) {
      const direct = await axios.get('http://127.0.0.1:5000/api/stats', { timeout: 3000 });
      return direct.data;
    }
  },

  getCustomers: async (params = {}) => {
    try {
      const res = await apiClient.get('/customers', { params });
      return res.data;
    } catch (err) {
      const direct = await axios.get('http://127.0.0.1:5000/api/customers', { params, timeout: 3000 });
      return direct.data;
    }
  },

  getClusters: async () => {
    try {
      const res = await apiClient.get('/clusters');
      return res.data;
    } catch (err) {
      const direct = await axios.get('http://127.0.0.1:5000/api/clusters', { timeout: 3000 });
      return direct.data;
    }
  },

  predictCluster: async (customerData) => {
    try {
      const res = await apiClient.post('/predict', customerData);
      return res.data;
    } catch (err) {
      const direct = await axios.post('http://127.0.0.1:5000/api/predict', customerData, { timeout: 3000 });
      return direct.data;
    }
  },

  getScatterData: async () => {
    try {
      const res = await apiClient.get('/scatter-data');
      return res.data;
    } catch (err) {
      const direct = await axios.get('http://127.0.0.1:5000/api/scatter-data', { timeout: 3000 });
      return direct.data;
    }
  },
};

export default api;

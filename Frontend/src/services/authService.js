import axios from 'axios';

const API_BASE_URL = 'https://ef7tdq553uxezbuxr2pof34one0cpvud.lambda-url.sa-east-1.on.aws/api';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      throw new Error(' ');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

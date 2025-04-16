import axios from 'axios';
import {PROD_URL, STG_URL} from "@/const.js";

const API_URL = STG_URL+'/auth';

export const authService = {
  signup: async (userData) => {
    try {
      console.log(userData);
      const response = await axios.post(`${API_URL}/signup`, {
        ...userData,
        role: userData.role.value[0].toUpperCase()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during signup' };
    }
  },

  signin: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/signin`, credentials);
      const user = response.data.results[0];
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log("Set user in local storage");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during signin' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
}; 
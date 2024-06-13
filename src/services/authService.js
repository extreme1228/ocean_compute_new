import axios from 'axios';

const API_URL = 'http://localhost:3010'; // 后端服务器的URL


export const isAdmin = () => {
  const user_id = localStorage.getItem('user_id')
  return user_id === '1';
};



export const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  },
  register: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { username, password });
      return response.data;
    } catch (error) {
      console.log("lbw-debug",error)
      throw new Error('Registration failed');
    }
  }
};
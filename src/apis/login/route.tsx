import axios from 'axios';

const API_URL = 'https://4pjmo6b0e1.execute-api.us-east-1.amazonaws.com';

export interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterInput) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error en el registro');
  }
};

export const loginUser = async (data: LoginInput) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, data);
    return response.data; // { token, username }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error en el login');
  }
};
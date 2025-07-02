import axios from 'axios';

const API_URL = 'https://4pjmo6b0e1.execute-api.us-east-1.amazonaws.com';

export interface Pet {
  id?: string;
  nombre: string;
  tipo: string;
  edad: number;
  genero: string;
}

const authHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getPets = async (token: string): Promise<Pet[]> => {
  const res = await axios.get(`${API_URL}/mascotas`, authHeader(token));
  return res.data;
};

export const createPet = async (data: Pet, token: string): Promise<Pet> => {
  const res = await axios.post(`${API_URL}/mascotas`, data, authHeader(token));
  return res.data;
};

// ✅ PUT con path param
export const updatePet = async (data: Pet, token: string): Promise<void> => {
  if (!data.id) throw new Error('ID es requerido para actualizar');
  await axios.put(`${API_URL}/mascotas/${data.id}`, data, authHeader(token));
};

// ✅ DELETE con path param
export const deletePet = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/mascotas/${id}`, authHeader(token));
};

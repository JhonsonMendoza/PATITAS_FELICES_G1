import axios from 'axios';

const API_URL = 'https://4pjmo6b0e1.execute-api.us-east-1.amazonaws.com';

export interface Vacuna {
  id?: string;
  mascotaId: string;
  nombre: string;
  fecha: string;
  observaciones: string;
}

const authHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getVacunas = async (token: string): Promise<Vacuna[]> => {
  const res = await axios.get(`${API_URL}/vacunas/usuario`, authHeader(token));
  return res.data;
};

export const createVacuna = async (data: Vacuna, token: string): Promise<Vacuna> => {
  const res = await axios.post(`${API_URL}/vacunas`, data, authHeader(token));
  return res.data;
};

export const updateVacuna = async (id: string, data: Partial<Vacuna>, token: string): Promise<Vacuna> => {
  const res = await axios.put(`${API_URL}/vacunas/${id}`, data, authHeader(token));
  return res.data;
};

export const deleteVacuna = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/vacunas/${id}`, authHeader(token));
};

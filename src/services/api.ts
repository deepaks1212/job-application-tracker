import axios from 'axios';
import { Application, ApplicationStats, ApplicationListResponse } from '../types';

const api = axios.create({
  baseURL: '/api/applications',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApplicationAPI = {
  async getAll(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ApplicationListResponse> {
    const response = await api.get('', { params });
    return response.data;
  },

  async getById(id: string): Promise<Application> {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  async create(data: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> {
    const response = await api.post('', data);
    return response.data;
  },

  async update(id: string, data: Partial<Omit<Application, 'id' | 'created_at' | 'updated_at'>>): Promise<Application> {
    const response = await api.patch(`/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string; id: string }> {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  async getStats(): Promise<ApplicationStats> {
    const response = await api.get('/stats');
    return response.data;
  },
};

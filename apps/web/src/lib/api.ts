import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskDto = {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
};

export type UpdateTaskDto = Partial<CreateTaskDto>;

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getById: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  create: async (task: CreateTaskDto): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  },
  
  update: async (id: number, task: UpdateTaskDto): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;

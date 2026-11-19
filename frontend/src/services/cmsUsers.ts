import api from '@/lib/api';

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getUsers(): Promise<ManagedUser[]> {
  const res = await api.get<ApiResponse<ManagedUser[]>>('/auth/users');
  return res.data.data || [];
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ManagedUser> {
  const res = await api.post<ApiResponse<ManagedUser>>('/auth/users', data);
  return res.data.data;
}

export async function updateUser(
  id: number,
  data: { name: string; email: string; password?: string; confirmPassword?: string }
): Promise<ManagedUser> {
  const res = await api.put<ApiResponse<ManagedUser>>(`/auth/users/${id}`, data);
  return res.data.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/auth/users/${id}`);
}

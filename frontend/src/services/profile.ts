import api from '@/lib/api';
import type { ApiResponse, Profile } from '@/types/admin';

export async function getProfile(): Promise<Profile | null> {
  const res = await api.get<ApiResponse<Profile>>('/auth/profile');
  return res.data.data || null;
}

export async function updateProfile(data: { name: string; email: string }): Promise<Profile> {
  const res = await api.put<ApiResponse<Profile>>('/auth/profile', data);
  return res.data.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  await api.put('/auth/password', data);
}

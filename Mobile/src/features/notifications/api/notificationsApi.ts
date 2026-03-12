import apiClient from '@/src/lib/apiClient';

export const notificationsApi = {
  getAll: () => apiClient.get('/notifications'),
};

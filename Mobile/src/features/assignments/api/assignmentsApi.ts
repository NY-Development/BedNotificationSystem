import apiClient from '@/src/lib/apiClient';

export const assignmentsApi = {
  getMyAssignment: () => apiClient.get('/assignments/my'),
  createAssignment: (payload: {
    userId: string;
    deptId: string;
    wardName: string;
    beds: string[];
  }) => apiClient.post('/assignments/', payload),
  updateAssignment: (id: string, payload: Record<string, unknown>) =>
    apiClient.put(`/assignments/${encodeURIComponent(id)}`, payload),
  getExpiryDates: (userId: string) =>
    apiClient.get(`/assignments/user/${encodeURIComponent(userId)}/expiry`),
};

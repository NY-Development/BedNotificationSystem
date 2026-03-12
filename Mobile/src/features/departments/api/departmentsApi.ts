import apiClient from '@/src/lib/apiClient';

export const departmentsApi = {
  getDepartments: () => apiClient.get('/departments'),
  getDepartment: (id: string) => apiClient.get(`/departments/${encodeURIComponent(id)}`),
  createDepartment: (payload: {
    name: string;
    wards: Array<{ name: string; beds: Array<{ id: number }> }>;
  }) => apiClient.post('/departments', payload),
  updateDepartment: (id: string, payload: Record<string, unknown>) =>
    apiClient.put(`/departments/${encodeURIComponent(id)}`, payload),
  deleteDepartment: (id: string) => apiClient.delete(`/departments/${encodeURIComponent(id)}`),
};

import apiClient from '@/src/lib/apiClient';

export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  getSubscriptions: () => apiClient.get('/admin/subscriptions'),
  getUsers: () => apiClient.get('/auth/all'),
  getUserDetails: (id: string) => apiClient.get(`/admin/users/${encodeURIComponent(id)}`),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${encodeURIComponent(id)}`),
  activateSubscription: (userId: string) =>
    apiClient.put(`/admin/${encodeURIComponent(userId)}/activate`),
  deactivateSubscription: (userId: string) =>
    apiClient.put(`/admin/${encodeURIComponent(userId)}/deactivate`),
  updateUserData: (payload: { type: string; userId: string; newRole?: string }) =>
    apiClient.put('/admin/data', payload),
  getAllAssignments: () => apiClient.get('/admin/assignments'),
  getAllNotifications: () => apiClient.get('/admin/notifications'),
  // Supervisor endpoints for hospital structure
  addDepartment: (payload: { name: string }) =>
    apiClient.post('/supervisor/add-departments', payload),
  deleteDepartment: (deptId: string) =>
    apiClient.delete(`/supervisor/departments/${encodeURIComponent(deptId)}`),
  addWard: (deptId: string, payload: { name: string }) =>
    apiClient.post(`/supervisor/departments/${encodeURIComponent(deptId)}/wards`, payload),
  deleteWard: (deptId: string, wardId: string) =>
    apiClient.delete(
      `/supervisor/departments/${encodeURIComponent(deptId)}/wards/${encodeURIComponent(wardId)}`
    ),
  addBed: (deptId: string, wardId: string, payload: { id: number }) =>
    apiClient.post(
      `/supervisor/departments/${encodeURIComponent(deptId)}/wards/${encodeURIComponent(wardId)}/beds`,
      payload
    ),
  deleteBed: (deptId: string, wardId: string, bedId: string) =>
    apiClient.delete(
      `/supervisor/departments/${encodeURIComponent(deptId)}/wards/${encodeURIComponent(wardId)}/beds/${encodeURIComponent(bedId)}`
    ),
};

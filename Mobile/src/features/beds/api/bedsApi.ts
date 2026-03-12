import apiClient from '@/src/lib/apiClient';

export const bedsApi = {
  getDepartments: () => apiClient.get('/departments'),
  admitPatient: (payload: { deptId: string; wardName: string; bedId: string }) =>
    apiClient.post('/departments/admit', payload),
  dischargePatient: (payload: { deptId: string; wardName: string; bedId: string }) =>
    apiClient.post('/departments/discharge', payload),
};

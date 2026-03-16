import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBedStore } from '@/src/store/bedStore';
import apiClient from '@/src/lib/apiClient';
import type { Department } from '@/src/types';

export const DEPARTMENTS_QUERY_KEY = ['departments'] as const;

export const departmentsQueryOptions = {
  queryKey: DEPARTMENTS_QUERY_KEY,
  queryFn: async () => {
    const { setDepartments } = useBedStore.getState();
    const { data } = await apiClient.get<Department[]>('/departments');
    setDepartments(data);
    return data;
  },
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
  refetchInterval: 1000 * 60 * 5,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

export function useDepartments() {
  return useQuery(departmentsQueryOptions);
}

export function useAdmitPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { deptId: string; wardName: string; bedId: string }) => {
      const { data } = await apiClient.post('/departments/admit', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}

export function useDischargePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { deptId: string; wardName: string; bedId: string }) => {
      const { data } = await apiClient.post('/departments/discharge', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}

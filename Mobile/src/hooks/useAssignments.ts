import { useQuery } from '@tanstack/react-query';
import { useAssignmentStore } from '@/src/store/assignmentStore';
import apiClient from '@/src/lib/apiClient';
import type { Assignment } from '@/src/types';

export function useMyAssignment() {
  const { setMyAssignment } = useAssignmentStore();

  return useQuery({
    queryKey: ['myAssignment'],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment>('/assignments/my');
      setMyAssignment(data);
      return data;
    },
  });
}

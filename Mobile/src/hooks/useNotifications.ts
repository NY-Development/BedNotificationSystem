import { useQuery } from '@tanstack/react-query';
import { useNotificationStore } from '@/src/store/notificationStore';
import apiClient from '@/src/lib/apiClient';
import type { Notification } from '@/src/types';

export function useNotifications() {
  const { setNotifications } = useNotificationStore();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get<Notification[]>('/notifications');
      setNotifications(data);
      return data;
    },
  });
}

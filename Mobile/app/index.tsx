import { Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(onboarding)/splash" />;
  }

  if (user?.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Redirect href="/(staff)/dashboard" />;
}

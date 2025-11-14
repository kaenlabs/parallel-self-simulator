import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, RegisterInput, LoginInput } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: meData, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data.user);
        router.push('/create');
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data.user);
        router.push('/dashboard');
      }
    },
  });

  const logout = () => {
    authApi.logout();
    logoutStore();
    queryClient.clear();
    router.push('/');
  };

  return {
    user: meData?.data?.user || user,
    isAuthenticated,
    isLoading,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
  };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, CreateProfileInput, UpdateProfileInput } from '@/lib/api/events';
import { useProfileStore } from '@/store/profileStore';

export function useProfile() {
  const { profile, setProfile } = useProfileStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await profileApi.getMyProfile();
      if (response.data) {
        setProfile(response.data.profile);
      }
      return response;
    },
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: profileApi.create,
    onSuccess: (data) => {
      if (data.data) {
        setProfile(data.data.profile);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileInput }) =>
      profileApi.update(id, data),
    onSuccess: (data) => {
      if (data.data) {
        setProfile(data.data.profile);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });

  const pauseMutation = useMutation({
    mutationFn: profileApi.pause,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: profileApi.resume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: data?.data?.profile || profile,
    isLoading,
    error,
    createProfile: createMutation.mutateAsync,
    updateProfile: updateMutation.mutateAsync,
    pauseProfile: pauseMutation.mutateAsync,
    resumeProfile: resumeMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}

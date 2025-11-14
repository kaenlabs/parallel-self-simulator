import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events';

export function useEvents() {
  const queryClient = useQueryClient();

  const todayQuery = useQuery({
    queryKey: ['events', 'today'],
    queryFn: eventsApi.getToday,
    refetchOnMount: true,
  });

  const historyQuery = useQuery({
    queryKey: ['events', 'history'],
    queryFn: () => eventsApi.getHistory(1, 20),
  });

  const generateMutation = useMutation({
    mutationFn: eventsApi.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    todayEvent: todayQuery.data?.data,
    isTodayLoading: todayQuery.isLoading,
    history: historyQuery.data?.data,
    isHistoryLoading: historyQuery.isLoading,
    events: historyQuery.data?.data?.items || [],
    isLoading: historyQuery.isLoading,
    generateEvent: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
  };
}

export function useEventById(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
}

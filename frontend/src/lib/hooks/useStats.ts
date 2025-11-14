import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/lib/api/events';

export function useStats() {
  const dashboardQuery = useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: statsApi.getDashboard,
  });

  const trendsQuery = useQuery({
    queryKey: ['stats', 'trends'],
    queryFn: () => statsApi.getTrends(30),
  });

  return {
    dashboard: dashboardQuery.data?.data,
    isDashboardLoading: dashboardQuery.isLoading,
    trends: trendsQuery.data?.data,
    isTrendsLoading: trendsQuery.isLoading,
  };
}

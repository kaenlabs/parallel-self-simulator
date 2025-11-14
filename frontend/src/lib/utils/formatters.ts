import { DashboardStats, EventType, EventCategory } from '@/types';

export function getEventTypeColor(type: EventType): string {
  const colors: Record<EventType, string> = {
    SUCCESS: 'text-success-600 bg-success-50',
    FAILURE: 'text-danger-600 bg-danger-50',
    SOCIAL: 'text-blue-600 bg-blue-50',
    FINANCIAL: 'text-green-600 bg-green-50',
    INTERNAL: 'text-purple-600 bg-purple-50',
    IDEA: 'text-yellow-600 bg-yellow-50',
    CONFLICT: 'text-red-600 bg-red-50',
  };
  return colors[type] || 'text-gray-600 bg-gray-50';
}

export function getEventTypeLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    SUCCESS: 'Başarı',
    FAILURE: 'Hata',
    SOCIAL: 'Sosyal',
    FINANCIAL: 'Maddi',
    INTERNAL: 'İçsel',
    IDEA: 'Fikir',
    CONFLICT: 'Çatışma',
  };
  return labels[type] || type;
}

export function getCategoryColor(category: EventCategory): string {
  const colors: Record<EventCategory, string> = {
    POSITIVE: 'text-success-600 bg-success-50',
    NEGATIVE: 'text-danger-600 bg-danger-50',
    NEUTRAL: 'text-gray-600 bg-gray-50',
  };
  return colors[category] || 'text-gray-600 bg-gray-50';
}

export function getImpactColor(impact: number): string {
  if (impact > 50) return 'text-success-600';
  if (impact > 20) return 'text-success-500';
  if (impact > 0) return 'text-green-500';
  if (impact === 0) return 'text-gray-500';
  if (impact > -20) return 'text-orange-500';
  if (impact > -50) return 'text-danger-500';
  return 'text-danger-600';
}

export function formatScore(score: number): string {
  return score >= 0 ? `+${score}` : `${score}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return formatDate(dateString);
}

export function getTrendIcon(direction: 'up' | 'down' | 'stable'): string {
  const icons = {
    up: '📈',
    down: '📉',
    stable: '➡️',
  };
  return icons[direction];
}

export function getTrendColor(direction: 'up' | 'down' | 'stable'): string {
  const colors = {
    up: 'text-success-600',
    down: 'text-danger-600',
    stable: 'text-gray-600',
  };
  return colors[direction];
}

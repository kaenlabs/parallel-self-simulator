'use client';

import { useStats } from '@/lib/hooks/useStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getEventTypeLabel, getEventTypeColor, getImpactColor, formatScore } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function StatsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { dashboard: stats, isDashboardLoading: isLoading } = useStats();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">İstatistikler yükleniyor...</p>
      </div>
    );
  }

  const getTrendEmoji = (direction: string) => {
    switch (direction) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendText = (direction: string) => {
    switch (direction) {
      case 'up': return 'Yükseliş';
      case 'down': return 'Düşüş';
      default: return 'Sabit';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="text-primary-600 hover:text-primary-700 mb-2"
          >
            ← Dashboard'a Dön
          </button>
          <h1 className="text-2xl font-bold text-gray-900">📊 İstatistikler</h1>
          <p className="text-gray-600">Detaylı analiz ve gelişim takibi</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profil Özeti */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📈 Genel Durum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Karakter</p>
                <p className="text-2xl font-bold">{stats.profile.characterName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Geçen Gün</p>
                <p className="text-2xl font-bold">{stats.profile.currentDay}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kümülatif Skor</p>
                <p className={`text-2xl font-bold ${getImpactColor(stats.profile.cumulativeScore)}`}>
                  {formatScore(stats.profile.cumulativeScore)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durum</p>
                <Badge variant={stats.profile.status === 'ACTIVE' ? 'success' : 'default'}>
                  {stats.profile.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Son 7 Gün Trendi */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {getTrendEmoji(stats.recentTrend.trendDirection)} Son 7 Gün Trendi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge 
                variant={
                  stats.recentTrend.trendDirection === 'up' ? 'success' : 
                  stats.recentTrend.trendDirection === 'down' ? 'danger' : 'default'
                }
              >
                {getTrendText(stats.recentTrend.trendDirection)}
              </Badge>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {stats.recentTrend.last7Days.map((score: number, idx: number) => {
                const maxAbs = Math.max(...stats.recentTrend.last7Days.map(Math.abs));
                const height = maxAbs > 0 ? (Math.abs(score) / maxAbs) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className={`w-full ${
                          score > 0 ? 'bg-success-500' : score < 0 ? 'bg-danger-500' : 'bg-gray-300'
                        } rounded-t`}
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{formatScore(score)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Olay Dağılımı */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Olay Dağılımı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.eventDistribution.map((dist: any) => (
                  <div key={dist.type}>
                    <div className="flex justify-between items-center mb-1">
                      <Badge className={getEventTypeColor(dist.type)}>
                        {getEventTypeLabel(dist.type)}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {dist.count} ({dist.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detaylı İstatistikler */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Detaylı İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Gün:</span>
                  <span className="font-semibold">{stats.stats.totalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Başarı Sayısı:</span>
                  <span className="font-semibold text-success-600">{stats.stats.successCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hata Sayısı:</span>
                  <span className="font-semibold text-danger-600">{stats.stats.failureCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sosyal Olaylar:</span>
                  <span className="font-semibold">{stats.stats.socialCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maddi Olaylar:</span>
                  <span className="font-semibold">{stats.stats.financialCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">İçsel Olaylar:</span>
                  <span className="font-semibold">{stats.stats.internalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fikir Olayları:</span>
                  <span className="font-semibold">{stats.stats.ideaCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Çatışma Olayları:</span>
                  <span className="font-semibold">{stats.stats.conflictCount}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-600">Ortalama Etki:</span>
                  <span className={`font-semibold ${getImpactColor(stats.stats.averageImpact)}`}>
                    {formatScore(stats.stats.averageImpact)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mevcut Seri:</span>
                  <span className="font-semibold">{stats.stats.currentStreak} gün</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En Uzun Seri:</span>
                  <span className="font-semibold">{stats.stats.longestStreak} gün</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

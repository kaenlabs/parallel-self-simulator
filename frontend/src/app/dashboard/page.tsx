'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProfile } from '@/lib/hooks/useProfile';
import { useEvents } from '@/lib/hooks/useEvents';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getEventTypeLabel, getEventTypeColor, getImpactColor, formatScore } from '@/lib/utils/formatters';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { todayEvent, isTodayLoading } = useEvents();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    router.push('/create');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎭 {profile.characterName}</h1>
            <p className="text-sm text-gray-600">Hoş geldin, {user?.name}</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right">
              <p className="text-sm text-gray-600">Gün</p>
              <p className="text-xl font-bold">{profile.currentDay}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Skor</p>
              <p className={`text-xl font-bold ${getImpactColor(profile.cumulativeScore)}`}>
                {formatScore(profile.cumulativeScore)}
              </p>
            </div>
            <Button variant="ghost" onClick={logout}>
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Ana Özellik</p>
                <p className="font-semibold capitalize">{profile.mainTrait}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Zaaf</p>
                <p className="font-semibold capitalize">{profile.weakness}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Yetenek</p>
                <p className="font-semibold capitalize">{profile.talent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durum</p>
                <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'default'}>
                  {profile.status}
                </Badge>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Günlük Hedef</p>
              <p className="font-medium">{profile.dailyGoal}</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Event */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📅 Bugünün Olayı</CardTitle>
          </CardHeader>
          <CardContent>
            {isTodayLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Olay yükleniyor...</p>
              </div>
            ) : todayEvent?.event ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getEventTypeColor(todayEvent.event.eventType)}>
                    {getEventTypeLabel(todayEvent.event.eventType)}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Gün {todayEvent.event.dayNumber}
                  </span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">
                    Yoğunluk: {todayEvent.event.intensity}/10
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-4">{todayEvent.event.title}</h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {todayEvent.event.description}
                </p>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Etki Puanı</p>
                    <p className={`text-3xl font-bold ${getImpactColor(todayEvent.event.impactScore)}`}>
                      {formatScore(todayEvent.event.impactScore)}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm text-gray-600">Kümülatif Skor</p>
                    <p className={`text-3xl font-bold ${getImpactColor(todayEvent.cumulativeScore)}`}>
                      {formatScore(todayEvent.cumulativeScore)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Henüz bir olay yok. Bir sonraki gün bekleniyor...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/events">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2">📚</div>
                <h3 className="font-semibold">Olay Geçmişi</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Tüm olaylarınızı görüntüleyin
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/stats">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-semibold">İstatistikler</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Detaylı analiz ve grafikler
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/profile">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-2">⚙️</div>
                <h3 className="font-semibold">Ayarlar</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Profil yönetimi
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

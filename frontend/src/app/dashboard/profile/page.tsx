'use client';

import { useProfile } from '@/lib/hooks/useProfile';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { profile, isLoading } = useProfile();

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

  if (!profile) {
    return null;
  }

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
          <h1 className="text-2xl font-bold text-gray-900">⚙️ Profil Ayarları</h1>
          <p className="text-gray-600">Hesap ve paralel benlik bilgileri</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Kullanıcı Bilgileri */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>👤 Hesap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">İsim</p>
                <p className="text-lg font-semibold">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">E-posta</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Üyelik Tarihi</p>
                <p className="text-lg font-semibold">
                  {new Date(profile.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paralel Benlik Bilgileri */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎭 Paralel Benlik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600">Karakter Adı</p>
                <p className="text-2xl font-bold">{profile.characterName}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Ana Özellik</p>
                  <Badge variant="info" className="mt-1 capitalize">
                    {profile.mainTrait}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zaaf</p>
                  <Badge variant="warning" className="mt-1 capitalize">
                    {profile.weakness}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yetenek</p>
                  <Badge variant="success" className="mt-1 capitalize">
                    {profile.talent}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Günlük Hedef</p>
                <p className="text-lg mt-1">{profile.dailyGoal}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Benzersiz Seed (SHA-256)</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {profile.seed}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ Bu seed, tüm olaylarınızı deterministik olarak üretir. Aynı özellikler her zaman aynı olayları oluşturur.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Başlangıç Tarihi</p>
                  <p className="font-semibold">
                    {new Date(profile.startDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durum</p>
                  <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'default'}>
                    {profile.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uyarı */}
        <Card className="border-warning-200 bg-warning-50">
          <CardContent className="py-4">
            <p className="text-sm text-warning-800">
              <strong>⚠️ Not:</strong> Paralel benlik özellikleri değiştirilemez. 
              Bu özellikler benzersiz seed'inizi ve tüm olaylarınızı belirler. 
              Yeni bir paralel benlik oluşturmak isterseniz yeni bir hesap açmanız gerekir.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

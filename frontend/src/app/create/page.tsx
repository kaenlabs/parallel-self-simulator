'use client';

import { useState } from 'react';
import { useProfile } from '@/lib/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

const TRAITS = ['cesur', 'temkinli', 'yaratıcı', 'analitik', 'sosyal', 'içedönük', 'hırslı', 'mütevazı'];
const WEAKNESSES = ['sabırsız', 'aşırı düşünen', 'güvensiz', 'dağınık', 'bencil', 'inatçı', 'tembel'];
const TALENTS = ['liderlik', 'sanat', 'spor', 'müzik', 'teknoloji', 'iletişim', 'problem çözme', 'empati'];

export default function CreateProfilePage() {
  const router = useRouter();
  const { createProfile, isCreating } = useProfile();
  const [formData, setFormData] = useState({
    characterName: '',
    mainTrait: '',
    weakness: '',
    talent: '',
    dailyGoal: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createProfile(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profil oluşturulamadı');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              🎭 Paralel Benliğinizi Oluşturun
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              5 özellik ile alternatif versiyonunuzu tanımlayın
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Karakter Adı"
                type="text"
                value={formData.characterName}
                onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
                placeholder="Örn: Alternatif Ben, Paralel Kaan"
                required
              />

              <div>
                <label className="label">Ana Özellik</label>
                <select
                  className="input"
                  value={formData.mainTrait}
                  onChange={(e) => setFormData({ ...formData, mainTrait: e.target.value })}
                  required
                >
                  <option value="">Seçiniz...</option>
                  {TRAITS.map((trait) => (
                    <option key={trait} value={trait}>
                      {trait.charAt(0).toUpperCase() + trait.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Karakterinizin temel kişilik özelliği
                </p>
              </div>

              <div>
                <label className="label">Zaaf</label>
                <select
                  className="input"
                  value={formData.weakness}
                  onChange={(e) => setFormData({ ...formData, weakness: e.target.value })}
                  required
                >
                  <option value="">Seçiniz...</option>
                  {WEAKNESSES.map((weakness) => (
                    <option key={weakness} value={weakness}>
                      {weakness.charAt(0).toUpperCase() + weakness.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Karakterinizin zayıf noktası
                </p>
              </div>

              <div>
                <label className="label">Yetenek</label>
                <select
                  className="input"
                  value={formData.talent}
                  onChange={(e) => setFormData({ ...formData, talent: e.target.value })}
                  required
                >
                  <option value="">Seçiniz...</option>
                  {TALENTS.map((talent) => (
                    <option key={talent} value={talent}>
                      {talent.charAt(0).toUpperCase() + talent.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Karakterinizin özel becerisi
                </p>
              </div>

              <div>
                <label className="label">Günlük Hedef</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.dailyGoal}
                  onChange={(e) => setFormData({ ...formData, dailyGoal: e.target.value })}
                  placeholder="Örn: İnsanlara ilham vermek, dünyayı daha iyi bir yer yapmak"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Karakterinizin motivasyonu ve amacı
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>İpucu:</strong> Bu özellikler sizin için benzersiz bir "seed" oluşturacak. 
                  Aynı özellikler her zaman aynı olayları üretir!
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isCreating}>
                Paralel Benliğimi Oluştur
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

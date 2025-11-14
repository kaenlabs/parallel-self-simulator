'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/lib/api/client';
import { getEventTypeLabel, getEventTypeColor, getImpactColor, formatScore } from '@/lib/utils/formatters';

export default function TestPanelPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Test verileri
  const [testData, setTestData] = useState({
    characterName: 'Test Karakter',
    mainTrait: 'cesur',
    weakness: 'sabırsız',
    talent: 'liderlik',
    dailyGoal: 'Dünyayı değiştirmek',
  });

  const testHealthCheck = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data: any = await apiClient.get('/health');
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Health check başarısız');
    } finally {
      setLoading(false);
    }
  };

  const testSeedGeneration = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data: any = await apiClient.post('/test/generate-seed', testData);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Seed generation başarısız');
    } finally {
      setLoading(false);
    }
  };

  const testEventGeneration = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data: any = await apiClient.post('/test/generate-event', {
        ...testData,
        dayNumber: 1,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Event generation başarısız');
    } finally {
      setLoading(false);
    }
  };

  const testMultipleEvents = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data: any = await apiClient.post('/test/generate-multiple-events', {
        ...testData,
        days: 7,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Multiple events generation başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Test Paneli
          </h1>
          <p className="text-gray-600">
            Backend API'lerini test edin ve deterministik olayları görün
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sol Kolon - Test Kontrolleri */}
          <div className="space-y-6">
            {/* Test Verileri */}
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Test Verileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Karakter Adı"
                  value={testData.characterName}
                  onChange={(e) => setTestData({ ...testData, characterName: e.target.value })}
                />
                
                <div>
                  <label className="label">Ana Özellik</label>
                  <select
                    className="input"
                    value={testData.mainTrait}
                    onChange={(e) => setTestData({ ...testData, mainTrait: e.target.value })}
                  >
                    <option value="cesur">Cesur</option>
                    <option value="temkinli">Temkinli</option>
                    <option value="yaratıcı">Yaratıcı</option>
                    <option value="analitik">Analitik</option>
                    <option value="sosyal">Sosyal</option>
                    <option value="içedönük">İçedönük</option>
                    <option value="hırslı">Hırslı</option>
                    <option value="mütevazı">Mütevazı</option>
                  </select>
                </div>

                <div>
                  <label className="label">Zaaf</label>
                  <select
                    className="input"
                    value={testData.weakness}
                    onChange={(e) => setTestData({ ...testData, weakness: e.target.value })}
                  >
                    <option value="sabırsız">Sabırsız</option>
                    <option value="aşırı düşünen">Aşırı Düşünen</option>
                    <option value="güvensiz">Güvensiz</option>
                    <option value="dağınık">Dağınık</option>
                    <option value="bencil">Bencil</option>
                    <option value="inatçı">İnatçı</option>
                    <option value="tembel">Tembel</option>
                  </select>
                </div>

                <div>
                  <label className="label">Yetenek</label>
                  <select
                    className="input"
                    value={testData.talent}
                    onChange={(e) => setTestData({ ...testData, talent: e.target.value })}
                  >
                    <option value="liderlik">Liderlik</option>
                    <option value="sanat">Sanat</option>
                    <option value="spor">Spor</option>
                    <option value="müzik">Müzik</option>
                    <option value="teknoloji">Teknoloji</option>
                    <option value="iletişim">İletişim</option>
                    <option value="problem çözme">Problem Çözme</option>
                    <option value="empati">Empati</option>
                  </select>
                </div>

                <Input
                  label="Günlük Hedef"
                  value={testData.dailyGoal}
                  onChange={(e) => setTestData({ ...testData, dailyGoal: e.target.value })}
                />
              </CardContent>
            </Card>

            {/* Test Butonları */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Testler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={testHealthCheck} 
                  isLoading={loading}
                  className="w-full"
                  variant="secondary"
                >
                  🏥 Health Check
                </Button>
                
                <Button 
                  onClick={testSeedGeneration} 
                  isLoading={loading}
                  className="w-full"
                >
                  🔑 Seed Üret
                </Button>
                
                <Button 
                  onClick={testEventGeneration} 
                  isLoading={loading}
                  className="w-full"
                  variant="success"
                >
                  🎲 Tek Olay Üret (Gün 1)
                </Button>
                
                <Button 
                  onClick={testMultipleEvents} 
                  isLoading={loading}
                  className="w-full"
                  variant="primary"
                >
                  📚 7 Günlük Olay Üret
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Kolon - Sonuçlar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>📋 Sonuçlar</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                    <strong>❌ Hata:</strong> {error}
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    {/* Seed Sonucu */}
                    {result.seed && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Üretilen Seed:</p>
                        <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                          {result.seed}
                        </p>
                      </div>
                    )}

                    {/* Tek Olay Sonucu */}
                    {result.event && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getEventTypeColor(result.event.eventType)}>
                            {getEventTypeLabel(result.event.eventType)}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Gün {result.event.dayNumber}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2">{result.event.title}</h3>
                        <p className="text-gray-700 mb-4">{result.event.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Yoğunluk</p>
                            <p className="font-semibold">{result.event.intensity}/10</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Etki</p>
                            <p className={`font-semibold ${getImpactColor(result.event.impactScore)}`}>
                              {formatScore(result.event.impactScore)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Çoklu Olay Sonucu */}
                    {result.events && Array.isArray(result.events) && (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {result.events.map((event: any, idx: number) => (
                          <div key={idx} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getEventTypeColor(event.eventType)}>
                                {getEventTypeLabel(event.eventType)}
                              </Badge>
                              <span className="text-xs text-gray-600">Gün {event.dayNumber}</span>
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                            <div className="flex justify-between text-xs">
                              <span>Yoğunluk: {event.intensity}/10</span>
                              <span className={getImpactColor(event.impactScore)}>
                                {formatScore(event.impactScore)}
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        {result.summary && (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-4">
                            <p className="text-sm font-semibold mb-2">📊 Özet:</p>
                            <div className="text-xs space-y-1">
                              <p>Toplam Etki: <span className={getImpactColor(result.summary.totalImpact)}>
                                {formatScore(result.summary.totalImpact)}
                              </span></p>
                              <p>Ortalama: {formatScore(result.summary.averageImpact)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Health Check Sonucu */}
                    {result.status === 'ok' && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-green-700 font-semibold">✅ Backend Çalışıyor</p>
                        <pre className="text-xs mt-2 text-gray-600">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Raw JSON */}
                    {!result.status && !result.event && !result.events && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Raw Response:</p>
                        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {!result && !error && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-2">🧪</p>
                    <p>Test sonuçları burada görünecek</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

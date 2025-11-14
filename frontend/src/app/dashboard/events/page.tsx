'use client';

import { useEvents } from '@/lib/hooks/useEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getEventTypeLabel, getEventTypeColor, getImpactColor, formatScore } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { events, isLoading } = useEvents();

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
          <h1 className="text-2xl font-bold text-gray-900">📚 Olay Geçmişi</h1>
          <p className="text-gray-600">Tüm paralel hayat olaylarınız</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!events || events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">Henüz Olay Yok</h3>
              <p className="text-gray-600">
                İlk olayınız otomatik olarak oluşturulacak. Biraz bekleyin!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Toplam {events.length} olay</p>
            </div>

            {events.map((event: any) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                        <span className="text-sm text-gray-500">Gün {event.dayNumber}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          Yoğunluk: {event.intensity}/10
                        </span>
                      </div>
                      <CardTitle>{event.title}</CardTitle>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Etki</p>
                      <p className={`text-2xl font-bold ${getImpactColor(event.impactScore)}`}>
                        {formatScore(event.impactScore)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {new Date(event.generatedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, isRegistering } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalı');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt başarısız oldu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            🎭 Hesap Oluştur
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Paralel benliğinizi oluşturmaya başlayın
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="İsim"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Adınız Soyadınız"
              required
            />

            <Input
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ornek@email.com"
              required
            />

            <Input
              label="Şifre"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="En az 8 karakter"
              required
            />

            <Input
              label="Şifre Tekrar"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Şifrenizi tekrar girin"
              required
            />

            <Button type="submit" className="w-full" isLoading={isRegistering}>
              Kayıt Ol
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Giriş Yapın
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

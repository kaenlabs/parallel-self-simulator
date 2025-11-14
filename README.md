# Parallel Self Simulator

Kullanıcıların kendilerinin alternatif bir versiyonunu oluşturduğu ve bu alternatif versiyon için her gün deterministik kurallarla bir olay üreten kapsamlı bir simülasyon sistemi.

## 🎯 Özellikler

- **Deterministik Olay Üretimi**: AI kullanmadan, matematiksel formüllerle günlük olaylar
- **7 Olay Kategorisi**: Başarı, hata, sosyal, maddi, içsel, fikir, çatışma
- **Seed-based Sistem**: Her kullanıcı için benzersiz deterministik profil
- **Modern Stack**: Next.js 14, Express, PostgreSQL, TypeScript
- **AI-Ready Mimari**: Gelecekteki AI entegrasyonuna hazır yapı

## 📁 Proje Yapısı

```
parallel-self-simulator/
├── frontend/                 # Next.js 14 frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities & helpers
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   └── public/              # Static assets
│
├── backend/                 # Express backend
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities
│   │   ├── validators/      # Input validation
│   │   └── scheduler/       # Cron jobs
│   └── prisma/              # Database schema
│
└── docs/                    # Documentation
    └── ARCHITECTURE.md      # System architecture
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### Adımlar

1. Bağımlılıkları yükle:
```bash
npm run install:all
```

2. PostgreSQL veritabanı oluştur:
```bash
createdb parallel_self_simulator
```

3. Environment dosyalarını ayarla:

**backend/.env**:
```
DATABASE_URL="postgresql://user:password@localhost:5432/parallel_self_simulator"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

**frontend/.env.local**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL=http://localhost:3000
```

4. Veritabanı migration:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. Uygulamayı başlat:
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:3001

## 📊 Sistem Mimarisi

### Deterministik Seed Sistemi
Her kullanıcı için benzersiz bir seed değeri üretilir:
```
seed = hash(ana_özellik + zaaf + yetenek + günlük_hedef + karakter_adı)
```

### Günlük Olay Üretimi
```
event_type = (seed + day_number) % 7
event_intensity = weighted_random(seed, day, traits)
event_description = event_pool[type][intensity]
```

### Olay Kategorileri
1. **Başarı**: Pozitif kazanımlar
2. **Hata**: Setback ve öğrenme
3. **Sosyal Etkileşim**: İlişkiler
4. **Maddi Durum**: Finansal olaylar
5. **İçsel His**: Duygu ve düşünceler
6. **Yeni Fikir**: Yaratıcı anlar
7. **Çatışma**: Zorluklar

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Mevcut kullanıcı

### Profile
- `POST /api/profile` - Paralel benlik oluştur
- `GET /api/profile/:id` - Profil detayları
- `PUT /api/profile/:id` - Profil güncelle

### Events
- `GET /api/events/today` - Günün olayı
- `GET /api/events/history` - Olay geçmişi
- `GET /api/events/:id` - Olay detayı
- `POST /api/events/generate` - Manuel olay üret (admin)

### Stats
- `GET /api/stats/dashboard` - Kullanıcı istatistikleri
- `GET /api/stats/trends` - Trend analizi

## 🎨 Frontend Sayfaları

- `/` - Ana sayfa ve onboarding
- `/create` - Paralel benlik oluşturma
- `/dashboard` - Günlük olay akışı
- `/event/[id]` - Olay detay sayfası
- `/stats` - İstatistikler ve grafikler
- `/profile` - Kullanıcı profili

## 🔐 Güvenlik

- JWT token authentication
- Password hashing (bcrypt)
- Input validation (Zod)
- SQL injection protection (Prisma)
- CORS configuration
- Rate limiting

## 🧪 Test

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📈 Gelecek Özellikler (AI Layer)

Mimari, gelecekte şu AI özellikleri için hazır:

```typescript
interface AILayer {
  generateDetailedStory(event: Event): Promise<Story>;
  analyzeSentiment(event: Event): Promise<Sentiment>;
  generateNextChapter(profile: Profile): Promise<Chapter>;
  predictTrends(history: Event[]): Promise<Prediction>;
}
```

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açın.

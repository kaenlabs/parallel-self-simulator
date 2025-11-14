# Parallel Self Simulator - Proje Dokümantasyonu

## 📑 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sistem Mimarisi](#sistem-mimarisi)
3. [Deterministik Olay Üretimi](#deterministik-olay-üretimi)
4. [API Endpoint'leri](#api-endpointleri)
5. [Veri Modelleri](#veri-modelleri)
6. [Frontend Yapısı](#frontend-yapısı)
7. [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
8. [Geliştirme Rehberi](#geliştirme-rehberi)
9. [Test Senaryoları](#test-senaryoları)
10. [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

---

## Genel Bakış

**Parallel Self Simulator**, kullanıcıların kendilerinin alternatif bir versiyonunu oluşturarak, bu versiyon için deterministik kurallarla günlük olaylar üreten bir simülasyon platformudur.

### Temel Kavramlar

#### 1. Paralel Benlik (Profile)
Kullanıcının oluşturduğu alternatif karakter. 5 temel özellik ile tanımlanır:
- **Ana Özellik** (mainTrait): Karakterin temel kişilik özelliği (örn: cesur, yaratıcı)
- **Zaaf** (weakness): Karakterin zayıf noktası (örn: sabırsız, güvensiz)
- **Yetenek** (talent): Özel becerisi (örn: liderlik, teknoloji)
- **Günlük Hedef** (dailyGoal): Karakterin motivasyonu
- **Karakter Adı** (characterName): Paralel benliğin ismi

#### 2. Seed Sistemi
Her profil için benzersiz bir "seed" değeri üretilir. Bu seed:
- 5 temel özellikten SHA-256 hash ile oluşturulur
- Aynı özellikler = aynı seed
- Her gün için deterministik olaylar üretir
- **Rastgelelik yoktur, tamamen deterministiktir**

#### 3. Günlük Olaylar (Events)
Her gün, profil için otomatik olarak bir olay üretilir. Olay özellikleri:
- **7 Kategori**: SUCCESS, FAILURE, SOCIAL, FINANCIAL, INTERNAL, IDEA, CONFLICT
- **Yoğunluk** (intensity): 1-10 arası
- **Etki Puanı** (impactScore): -100 ile +100 arası
- **Açıklama**: Profil özelliklerine göre şablondan oluşturulur

---

## Sistem Mimarisi

### Teknoloji Stack'i

#### Backend
```
Node.js + Express + TypeScript
├── Prisma ORM (PostgreSQL)
├── JWT Authentication
├── Zod Validation
├── Winston Logger
└── node-cron (Scheduler)
```

#### Frontend
```
Next.js 14 (App Router) + TypeScript
├── Tailwind CSS
├── TanStack Query (React Query)
├── Zustand (State Management)
├── React Hook Form + Zod
└── Recharts
```

### Klasör Yapısı

```
parallel-self-simulator/
├── backend/
│   ├── src/
│   │   ├── config/          # Yapılandırma ve sabitler
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # İş mantığı
│   │   ├── models/          # Veri modelleri
│   │   ├── middleware/      # Express middleware'ler
│   │   ├── routes/          # API rotaları
│   │   ├── utils/           # Yardımcı fonksiyonlar
│   │   ├── validators/      # Input validasyonları
│   │   ├── scheduler/       # Cron jobs
│   │   ├── data/            # Olay şablonları
│   │   ├── app.ts           # Express app
│   │   └── server.ts        # Server giriş noktası
│   └── prisma/
│       └── schema.prisma    # Veritabanı şeması
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages (App Router)
│   │   ├── components/      # React bileşenleri
│   │   ├── lib/             # API, hooks, utils
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript tipleri
│   │   └── styles/          # Global stiller
│   └── public/              # Statik dosyalar
│
└── docs/                    # Dokümantasyon
    └── ARCHITECTURE.md      # Detaylı mimari
```

---

## Deterministik Olay Üretimi

### Algoritma Akışı

```
1. SEED OLUŞTURMA
   ↓
   Input: mainTrait, weakness, talent, dailyGoal, characterName
   ↓
   Process: SHA-256 hash
   ↓
   Output: 64-karakter hex string
   
2. OLAY TİPİ BELİRLEME
   ↓
   Input: seed + dayNumber
   ↓
   Formula: (seedNum + dayNumber × 997) mod 7
   ↓
   Output: EventType (0-6 arası index)
   
3. YOĞUNLUK HESAPLAMA
   ↓
   Factors:
   - Base intensity (seed'den)
   - Trait modifiers (özellik bonusları)
   - Day pattern (sinüs dalgası)
   ↓
   Output: 1-10 arası intensity
   
4. ŞABLON SEÇİMİ
   ↓
   Filter: eventType ve intensity aralığına uygun şablonlar
   ↓
   Select: Deterministik index ile seçim
   ↓
   Fill: Profil bilgileri ile placeholder'ları doldur
   
5. ETKİ PUANI HESAPLAMA
   ↓
   Factors:
   - Base impact (olay tipine göre)
   - Intensity multiplier
   - Synergy bonus (özellikler arası uyum)
   ↓
   Output: -100 ile +100 arası impact
   
6. KÜMÜLATIF GÜNCELLEME
   ↓
   Update:
   - Profile.cumulativeScore += impactScore
   - Profile.currentDay++
   - ProfileStats (çeşitli istatistikler)
```

### Formüller

#### 1. Olay Tipi Belirleme
```typescript
seedNum = parseInt(seed.substring(0, 8), 16)
combined = seedNum + (dayNumber × 997)  // 997 asal sayı
typeIndex = combined % 7
```

#### 2. Yoğunluk Hesaplama
```typescript
baseIntensity = (seedNum % 10) + 1  // 1-10
traitModifier = mainTraitMod + weaknessMod × 0.7 + talentMod × 0.8
dayPattern = sin(dayNumber / 7) × 2  // ±2
intensity = clamp(baseIntensity + traitModifier + dayPattern, 1, 10)
```

#### 3. Etki Puanı
```typescript
baseImpact = EVENT_BASE_IMPACT[eventType]
intensityMultiplier = intensity / 5  // 0.2 - 2.0
impact = baseImpact × intensityMultiplier + synergyBonus
```

### Özellik Modifierleri

Her özellik, her olay tipine farklı etki eder:

```typescript
TRAIT_MODIFIERS = {
  'cesur': {
    SUCCESS: +2,    // Başarıda bonus
    FAILURE: -1,    // Hatada hafif malus
    CONFLICT: +2,   // Çatışmada bonus
    // ...
  },
  'temkinli': {
    SUCCESS: -1,    // Başarıda malus
    FAILURE: +1,    // Hatada bonus
    // ...
  },
  // ... diğer özellikler
}
```

---

## API Endpoint'leri

### Authentication

#### POST /api/auth/register
Yeni kullanıcı kaydı.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### POST /api/auth/login
Kullanıcı girişi.

#### GET /api/auth/me
Mevcut kullanıcı bilgilerini getir (Auth required).

---

### Profile

#### POST /api/profile
Yeni paralel benlik oluştur (Auth required).

**Request:**
```json
{
  "characterName": "Alternatif Ben",
  "mainTrait": "cesur",
  "weakness": "sabırsız",
  "talent": "liderlik",
  "dailyGoal": "insanlara ilham vermek"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "prof_xyz789",
      "characterName": "Alternatif Ben",
      "seed": "a3f5c8d9e2b1...",
      "currentDay": 0,
      "cumulativeScore": 0,
      "status": "ACTIVE"
    }
  }
}
```

#### GET /api/profile
Kullanıcının profilini getir (Auth required).

#### PUT /api/profile/:id
Profil güncelle (Auth required).

#### POST /api/profile/:id/pause
Profili duraklat (Auth required).

#### POST /api/profile/:id/resume
Profili devam ettir (Auth required).

---

### Events

#### GET /api/events/today
Bugünün olayını getir veya üret (Auth required).

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "evt_123",
      "dayNumber": 42,
      "eventType": "SUCCESS",
      "title": "Önemli Bir Başarı",
      "description": "Uzun süredir üzerinde...",
      "intensity": 8,
      "impactScore": 75
    },
    "cumulativeScore": 1250,
    "currentDay": 42
  }
}
```

#### GET /api/events/history
Olay geçmişini getir (pagination) (Auth required).

**Query Params:**
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına kayıt (default: 20)

#### GET /api/events/:id
Belirli bir olayın detayını getir (Auth required).

---

### Stats

#### GET /api/stats/dashboard
Dashboard istatistiklerini getir (Auth required).

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "characterName": "Alternatif Ben",
      "currentDay": 42,
      "cumulativeScore": 1250,
      "status": "ACTIVE"
    },
    "stats": {
      "totalDays": 42,
      "successCount": 8,
      "failureCount": 5,
      "averageImpact": 29.7,
      "currentStreak": 3,
      "longestStreak": 7
    },
    "recentTrend": {
      "last7Days": [45, 30, -20, 60, 55, 40, 75],
      "trendDirection": "up"
    },
    "eventDistribution": [
      { "type": "SUCCESS", "count": 8, "percentage": 19 },
      { "type": "FAILURE", "count": 5, "percentage": 12 }
      // ...
    ]
  }
}
```

#### GET /api/stats/trends
Trend analizi (Auth required).

**Query Params:**
- `days`: Kaç günlük analiz (default: 30)

---

## Veri Modelleri

### Prisma Schema

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  profile      Profile?
}

model Profile {
  id              String        @id @default(cuid())
  userId          String        @unique
  characterName   String
  mainTrait       String
  weakness        String
  talent          String
  dailyGoal       String
  seed            String        @unique
  currentDay      Int           @default(0)
  cumulativeScore Int           @default(0)
  status          ProfileStatus @default(ACTIVE)
  events          Event[]
  stats           ProfileStats?
}

model Event {
  id          String        @id @default(cuid())
  profileId   String
  dayNumber   Int
  eventType   EventType
  category    EventCategory
  title       String
  description String        @db.Text
  intensity   Int
  impactScore Int
  detailsJson Json?
  generatedAt DateTime      @default(now())
  
  @@unique([profileId, dayNumber])
}

model ProfileStats {
  id             String  @id @default(cuid())
  profileId      String  @unique
  totalDays      Int     @default(0)
  successCount   Int     @default(0)
  failureCount   Int     @default(0)
  // ... diğer sayaçlar
  averageImpact  Float   @default(0)
  currentStreak  Int     @default(0)
  longestStreak  Int     @default(0)
}
```

---

## Frontend Yapısı

### Next.js App Router Sayfaları

```
src/app/
├── page.tsx                  # Landing page
├── layout.tsx                # Root layout
├── (auth)/
│   ├── login/page.tsx        # Giriş sayfası
│   └── register/page.tsx     # Kayıt sayfası
├── create/page.tsx           # Profil oluşturma
├── (dashboard)/
│   ├── layout.tsx            # Dashboard layout
│   ├── page.tsx              # Ana dashboard
│   ├── events/
│   │   ├── page.tsx          # Olay geçmişi
│   │   └── [id]/page.tsx     # Olay detayı
│   ├── stats/page.tsx        # İstatistikler
│   └── profile/page.tsx      # Profil ayarları
```

### Component Yapısı

```
src/components/
├── ui/                       # Temel UI bileşenleri
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── Spinner.tsx
├── layout/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── DashboardLayout.tsx
├── profile/
│   ├── ProfileCard.tsx       # Profil özet kartı
│   ├── ProfileForm.tsx       # Profil oluşturma formu
│   └── ProfileStats.tsx      # İstatistik gösterimi
└── events/
    ├── EventCard.tsx         # Olay kartı
    ├── EventDetail.tsx       # Olay detayı
    └── EventTimeline.tsx     # Zaman çizelgesi
```

---

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### 1. Projeyi İndirin
```bash
cd "proje 2"
```

### 2. Bağımlılıkları Yükleyin
```bash
npm run install:all
```

### 3. Veritabanını Ayarlayın

PostgreSQL veritabanı oluşturun:
```bash
createdb parallel_self_simulator
```

Backend `.env` dosyası oluşturun:
```bash
cd backend
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```
DATABASE_URL="postgresql://user:password@localhost:5432/parallel_self_simulator"
JWT_SECRET="your-secret-key"
PORT=3001
```

Prisma migration çalıştırın:
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Frontend Environment
```bash
cd ../frontend
cp .env.local.example .env.local
```

### 5. Uygulamayı Başlatın

Root dizinden:
```bash
npm run dev
```

Veya ayrı ayrı:
```bash
# Backend
cd backend
npm run dev

# Frontend (başka terminal)
cd frontend
npm run dev
```

**Erişim:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Health: http://localhost:3001/api/health

---

## Geliştirme Rehberi

### Yeni Olay Şablonu Ekleme

`backend/src/data/eventTemplates.ts`:

```typescript
{
  eventType: 'SUCCESS',
  intensityMin: 4,
  intensityMax: 6,
  title: 'Yeni Başarı',
  descriptionTemplate: '{characterName} bugün {talent} sayesinde...',
  baseImpact: 60,
  tags: ['başarı', 'yeni'],
}
```

### Yeni Özellik Ekleme

`backend/src/config/constants.ts`:

```typescript
TRAIT_MODIFIERS = {
  'yeni_özellik': {
    SUCCESS: 2,
    FAILURE: 0,
    // ... diğer tipler
  },
}
```

### API Endpoint Ekleme

1. **Controller oluştur** (`controllers/`)
2. **Service ekle** (`services/`)
3. **Validator ekle** (`validators/`)
4. **Route tanımla** (`routes/`)
5. **Route'u index'e ekle** (`routes/index.ts`)

---

## Test Senaryoları

### Manuel Test Senaryoları

#### 1. Kullanıcı Kaydı ve Profil Oluşturma
```
1. POST /api/auth/register ile kayıt ol
2. Token'ı kaydet
3. POST /api/profile ile profil oluştur
4. Seed'in unique olduğunu kontrol et
```

#### 2. Günlük Olay Üretimi
```
1. GET /api/events/today çağır
2. İlk gün için olay üretildiğini kontrol et
3. Tekrar çağır - aynı olayı döndürmeli
4. cumulativeScore'un güncellendiğini kontrol et
```

#### 3. Deterministik Kontrol
```
1. İki farklı kullanıcı aynı özellikleri gir
2. Seed'lerin aynı olduğunu kontrol et
3. Aynı gün numarası için olayları karşılaştır
4. Olaylar tamamen aynı olmalı
```

#### 4. İstatistik Güncellemesi
```
1. Birkaç gün olay üret
2. GET /api/stats/dashboard çağır
3. totalDays, event counts doğru mu?
4. averageImpact hesaplaması doğru mu?
```

---

## Gelecek Geliştirmeler

### Faz 1: AI Entegrasyonu

```typescript
interface AIService {
  // Detaylı hikaye oluştur
  generateStory(event: Event): Promise<Story>;
  
  // Duygusal analiz
  analyzeSentiment(event: Event): Promise<Sentiment>;
  
  // İlerleyen bölümler
  generateNextChapter(profile: Profile): Promise<Chapter>;
}
```

**Kullanım:**
- Her olay için AI ile detaylı hikaye üret
- Kullanıcı etkileşimine göre dallanma
- Karakter gelişimi analizi

### Faz 2: Sosyal Özellikler
- Profilleri paylaşma
- Diğer kullanıcıların profilleriyle karşılaştırma
- Liderboard sistemi
- Arkadaş ekleme ve takip

### Faz 3: Gelişmiş Analitik
- Makine öğrenmesi ile trend tahmini
- Kişilik analizi
- Grafik ve görselleştirmeler
- Export özellikleri (PDF, JSON)

### Faz 4: Mobil Uygulama
- React Native ile mobil app
- Push notification (günlük olaylar)
- Offline mode
- Widget desteği

---

## Katkıda Bulunma

Projeye katkıda bulunmak için:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

---

## İletişim

Proje ile ilgili sorularınız için issue açabilirsiniz.

---

**Not:** Bu proje eğitim ve araştırma amaçlıdır. Production kullanımı için ek güvenlik önlemleri ve optimizasyonlar gerekebilir.

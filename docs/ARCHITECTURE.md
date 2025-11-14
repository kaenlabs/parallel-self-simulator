# Parallel Self Simulator - Sistem Mimarisi

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Veri Modelleri](#veri-modelleri)
4. [Deterministik Sistem](#deterministik-sistem)
5. [API Mimarisi](#api-mimarisi)
6. [Frontend Mimarisi](#frontend-mimarisi)
7. [Backend Mimarisi](#backend-mimarisi)
8. [Scheduler Sistemi](#scheduler-sistemi)
9. [AI Hazırlığı](#ai-hazırlığı)

---

## Genel Bakış

Parallel Self Simulator, kullanıcıların kendilerinin alternatif versiyonunu oluşturarak, bu versiyon için deterministik kurallarla günlük olaylar üreten bir simülasyon platformudur.

### Temel Prensipler
- **Deterministik**: Aynı input her zaman aynı output'u verir
- **Seed-based**: Her profil benzersiz bir seed'e sahiptir
- **Modüler**: Her katman bağımsız çalışabilir
- **Ölçeklenebilir**: Mikroservis mimarisine geçişe hazır
- **AI-Ready**: Gelecekte AI katmanı eklenebilir

---

## Teknoloji Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Context
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Auth**: NextAuth.js

**Neden Next.js 14?**
- Server Components ile performans
- App Router ile modern routing
- API Routes ile backend entegrasyonu
- SEO optimizasyonu
- TypeScript desteği

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken)
- **Scheduler**: node-cron
- **Testing**: Jest + Supertest

**Neden Express?**
- Hafif ve esnek
- Geniş middleware ekosistemi
- TypeScript desteği
- Mikroservis mimarisine uygun

### Database
- **Primary**: PostgreSQL 14+
- **ORM**: Prisma

**Neden PostgreSQL?**
- ACID compliance
- JSON desteği (gelecek AI özellikler için)
- Güçlü indeksleme
- Ölçeklenebilir

---

## Veri Modelleri

### User (Kullanıcı)
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
}
```

### Profile (Paralel Benlik)
```typescript
interface Profile {
  id: string;
  userId: string;
  characterName: string;
  mainTrait: string;        // ana özellik
  weakness: string;          // zaaf
  talent: string;            // yetenek
  dailyGoal: string;         // günlük hedef
  seed: string;              // deterministik seed
  startDate: Date;
  currentDay: number;
  cumulativeScore: number;
  status: ProfileStatus;     // active | paused | completed
  createdAt: Date;
  updatedAt: Date;
  events: Event[];
  stats: ProfileStats;
}

enum ProfileStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}
```

### Event (Olay)
```typescript
interface Event {
  id: string;
  profileId: string;
  dayNumber: number;
  eventType: EventType;
  category: EventCategory;
  title: string;
  description: string;
  intensity: number;         // 1-10
  impactScore: number;       // -100 to +100
  detailsJson: EventDetails; // Ek bilgiler
  generatedAt: Date;
  viewedAt?: Date;
}

enum EventType {
  SUCCESS = 'success',
  FAILURE = 'failure',
  SOCIAL = 'social',
  FINANCIAL = 'financial',
  INTERNAL = 'internal',
  IDEA = 'idea',
  CONFLICT = 'conflict'
}

enum EventCategory {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral'
}

interface EventDetails {
  subCategory?: string;
  emotionalImpact?: string;
  tags?: string[];
  aiReadyData?: {
    context: string;
    characters?: string[];
    location?: string;
  };
}
```

### ProfileStats (İstatistikler)
```typescript
interface ProfileStats {
  id: string;
  profileId: string;
  totalDays: number;
  successCount: number;
  failureCount: number;
  socialCount: number;
  financialCount: number;
  internalCount: number;
  ideaCount: number;
  conflictCount: number;
  averageImpact: number;
  currentStreak: number;
  longestStreak: number;
  updatedAt: Date;
}
```

### EventTemplate (Olay Şablonları)
```typescript
interface EventTemplate {
  id: string;
  eventType: EventType;
  intensityRange: [number, number];
  title: string;
  descriptionTemplate: string;
  baseImpact: number;
  tags: string[];
}
```

---

## Deterministik Sistem

### 1. Seed Üretimi

Kullanıcının girdiği 5 bilgiden benzersiz bir seed üretilir:

```typescript
function generateSeed(input: ProfileInput): string {
  const combined = [
    input.mainTrait,
    input.weakness,
    input.talent,
    input.dailyGoal,
    input.characterName
  ].join('|').toLowerCase();
  
  return hashFunction(combined); // SHA-256
}
```

**Seed Özellikleri:**
- 64 karakter hex string
- Aynı input = aynı seed
- Küçük değişiklik = tamamen farklı seed
- Collision'a karşı güvenli

### 2. Günlük Olay Üretimi

Her gün için deterministik olay üretimi:

```typescript
function generateDailyEvent(profile: Profile, day: number): Event {
  // 1. Olay tipini belirle
  const eventType = determineEventType(profile.seed, day);
  
  // 2. Yoğunluğu hesapla
  const intensity = calculateIntensity(profile, day, eventType);
  
  // 3. Şablonu seç
  const template = selectTemplate(eventType, intensity, profile);
  
  // 4. Etki puanını hesapla
  const impact = calculateImpact(profile, eventType, intensity);
  
  // 5. Olayı oluştur
  return createEvent(profile, day, eventType, template, intensity, impact);
}
```

#### 2.1. Olay Tipi Belirleme

```typescript
function determineEventType(seed: string, day: number): EventType {
  // Seed'in ilk 8 karakterini sayıya çevir
  const seedNum = parseInt(seed.substring(0, 8), 16);
  
  // Gün numarasıyla birleştir
  const combined = seedNum + (day * 997); // 997: prime number
  
  // 7 kategoriye böl
  const typeIndex = combined % 7;
  
  const types: EventType[] = [
    EventType.SUCCESS,
    EventType.FAILURE,
    EventType.SOCIAL,
    EventType.FINANCIAL,
    EventType.INTERNAL,
    EventType.IDEA,
    EventType.CONFLICT
  ];
  
  return types[typeIndex];
}
```

#### 2.2. Yoğunluk Hesaplama

```typescript
function calculateIntensity(
  profile: Profile, 
  day: number, 
  eventType: EventType
): number {
  // Base intensity (1-10)
  const seedNum = parseInt(profile.seed.substring(8, 16), 16);
  const baseIntensity = (seedNum % 10) + 1;
  
  // Trait modifiers
  const traitModifier = getTraitModifier(profile, eventType);
  
  // Day pattern (sinüs dalgası ile periyodik değişim)
  const dayPattern = Math.sin(day / 7) * 2; // ±2
  
  // Final intensity
  let intensity = baseIntensity + traitModifier + dayPattern;
  
  // Clamp to 1-10
  return Math.max(1, Math.min(10, Math.round(intensity)));
}

function getTraitModifier(profile: Profile, eventType: EventType): number {
  const modifiers: Record<string, Record<EventType, number>> = {
    // Ana özellik modifierleri
    'cesur': {
      [EventType.SUCCESS]: 2,
      [EventType.CONFLICT]: 1,
      [EventType.FAILURE]: -1,
      // ... diğer tipler
    },
    'temkinli': {
      [EventType.SUCCESS]: -1,
      [EventType.FAILURE]: 1,
      // ...
    },
    // ... daha fazla özellik
  };
  
  const mainTraitMod = modifiers[profile.mainTrait]?.[eventType] || 0;
  const weaknessMod = calculateWeaknessModifier(profile.weakness, eventType);
  const talentMod = calculateTalentModifier(profile.talent, eventType);
  
  return mainTraitMod + weaknessMod + talentMod;
}
```

#### 2.3. Şablon Seçimi

```typescript
function selectTemplate(
  eventType: EventType,
  intensity: number,
  profile: Profile
): EventTemplate {
  // İlgili tipteki tüm şablonları getir
  const templates = getTemplatesByType(eventType);
  
  // Yoğunluğa uygun olanları filtrele
  const matching = templates.filter(t => 
    intensity >= t.intensityRange[0] && 
    intensity <= t.intensityRange[1]
  );
  
  // Seed bazlı deterministik seçim
  const seedNum = parseInt(profile.seed.substring(16, 24), 16);
  const index = seedNum % matching.length;
  
  return matching[index];
}
```

#### 2.4. Etki Puanı Hesaplama

```typescript
function calculateImpact(
  profile: Profile,
  eventType: EventType,
  intensity: number
): number {
  // Base impact
  const baseImpactMap: Record<EventType, number> = {
    [EventType.SUCCESS]: 50,
    [EventType.FAILURE]: -40,
    [EventType.SOCIAL]: 20,
    [EventType.FINANCIAL]: 30,
    [EventType.INTERNAL]: 10,
    [EventType.IDEA]: 25,
    [EventType.CONFLICT]: -30
  };
  
  const baseImpact = baseImpactMap[eventType];
  
  // Intensity multiplier
  const intensityMultiplier = intensity / 5; // 0.2 to 2.0
  
  // Trait synergy bonus
  const synergyBonus = calculateSynergyBonus(profile, eventType);
  
  // Final impact
  const impact = baseImpact * intensityMultiplier + synergyBonus;
  
  // Clamp to -100 to +100
  return Math.max(-100, Math.min(100, Math.round(impact)));
}

function calculateSynergyBonus(profile: Profile, eventType: EventType): number {
  // Özellikler arası uyum bonusu
  const synergies: Record<string, string[]> = {
    'cesur-liderlik-başarı': ['cesur', 'liderlik'],
    'yaratıcı-sanat-fikir': ['yaratıcı', 'sanat'],
    // ... daha fazla sinerji
  };
  
  // Uyumlu özellikleri kontrol et ve bonus ver
  // Detaylı implementasyon...
  
  return 0; // Placeholder
}
```

### 3. Kümülatif Durum Güncelleme

```typescript
function updateCumulativeState(profile: Profile, event: Event): Profile {
  // Skoru güncelle
  profile.cumulativeScore += event.impactScore;
  
  // Gün sayısını artır
  profile.currentDay += 1;
  
  // Streak güncelle
  if (event.impactScore > 0) {
    profile.stats.currentStreak += 1;
    profile.stats.longestStreak = Math.max(
      profile.stats.longestStreak,
      profile.stats.currentStreak
    );
  } else if (event.impactScore < -30) {
    profile.stats.currentStreak = 0;
  }
  
  // İstatistikleri güncelle
  updateEventStats(profile.stats, event);
  
  return profile;
}
```

---

## API Mimarisi

### RESTful Endpoints

#### Authentication
```
POST   /api/auth/register          # Kullanıcı kaydı
POST   /api/auth/login             # Giriş
POST   /api/auth/logout            # Çıkış
GET    /api/auth/me                # Mevcut kullanıcı
POST   /api/auth/refresh           # Token yenileme
```

#### Profile Management
```
POST   /api/profile                # Yeni profil oluştur
GET    /api/profile/:id            # Profil detayları
PUT    /api/profile/:id            # Profil güncelle
DELETE /api/profile/:id            # Profili sil
GET    /api/profile/:id/stats      # Profil istatistikleri
POST   /api/profile/:id/pause      # Profili duraklat
POST   /api/profile/:id/resume     # Profili devam ettir
```

#### Event Management
```
GET    /api/events/today           # Bugünün olayı
GET    /api/events/history         # Olay geçmişi (pagination)
GET    /api/events/:id             # Olay detayı
POST   /api/events/generate        # Manuel olay üret (admin/test)
PUT    /api/events/:id/view        # Olay görüntülendiği işaretle
```

#### Statistics
```
GET    /api/stats/dashboard        # Dashboard istatistikleri
GET    /api/stats/trends           # Trend analizi
GET    /api/stats/comparison       # Karşılaştırmalı analiz
```

### Request/Response Örnekleri

#### POST /api/profile
```json
// Request
{
  "characterName": "Alternatif Ben",
  "mainTrait": "cesur",
  "weakness": "sabırsız",
  "talent": "liderlik",
  "dailyGoal": "insanlara ilham vermek"
}

// Response
{
  "success": true,
  "data": {
    "id": "prof_abc123",
    "characterName": "Alternatif Ben",
    "seed": "a3f5c8d9...",
    "currentDay": 0,
    "cumulativeScore": 0,
    "status": "active",
    "createdAt": "2025-11-14T10:00:00Z"
  }
}
```

#### GET /api/events/today
```json
// Response
{
  "success": true,
  "data": {
    "id": "evt_xyz789",
    "dayNumber": 42,
    "eventType": "success",
    "title": "Önemli Bir Başarı",
    "description": "Uzun süredir üzerinde çalıştığın proje sonunda tamamlandı...",
    "intensity": 8,
    "impactScore": 75,
    "generatedAt": "2025-11-14T00:00:00Z",
    "cumulativeScore": 1250,
    "message": "Harika bir gün! Skor: +75"
  }
}
```

### Middleware Chain

```typescript
// Typical request flow
Request 
  → CORS middleware
  → Body parser
  → Request logger
  → Rate limiter
  → Auth middleware (if protected)
  → Validation middleware
  → Controller
  → Service layer
  → Database
  → Response formatter
  → Error handler
```

---

## Frontend Mimarisi

### Klasör Yapısı

```
frontend/src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Dashboard group
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Main dashboard
│   │   ├── event/[id]/
│   │   ├── stats/
│   │   └── profile/
│   ├── create/                   # Profile creation
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── DashboardLayout.tsx
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileForm.tsx
│   │   └── ProfileStats.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventDetail.tsx
│   │   ├── EventTimeline.tsx
│   │   └── EventList.tsx
│   └── stats/
│       ├── StatsChart.tsx
│       ├── TrendChart.tsx
│       └── ScoreGauge.tsx
│
├── lib/
│   ├── api/                      # API client
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── events.ts
│   │   └── stats.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useProfile.ts
│   │   ├── useEvents.ts
│   │   ├── useAuth.ts
│   │   └── useStats.ts
│   ├── utils/                    # Utilities
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   └── schemas/                  # Zod schemas
│       └── profile.schema.ts
│
├── store/                        # State management
│   ├── authStore.ts
│   ├── profileStore.ts
│   └── uiStore.ts
│
├── types/                        # TypeScript types
│   ├── api.types.ts
│   ├── profile.types.ts
│   └── event.types.ts
│
└── styles/
    └── globals.css
```

### Component Yapısı

#### Atomic Design Principles

1. **Atoms**: `Button`, `Input`, `Badge`, `Icon`
2. **Molecules**: `ProfileCard`, `EventCard`, `StatItem`
3. **Organisms**: `EventTimeline`, `StatsChart`, `ProfileForm`
4. **Templates**: `DashboardLayout`, `AuthLayout`
5. **Pages**: App Router pages

### State Management

**Zustand Store Örneği:**

```typescript
// store/profileStore.ts
interface ProfileStore {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  setProfile: (profile: Profile) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  clearProfile: () => void;
}
```

### Data Fetching

**TanStack Query kullanımı:**

```typescript
// hooks/useProfile.ts
export function useProfile(profileId: string) {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => fetchProfile(profileId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

---

## Backend Mimarisi

### Klasör Yapısı

```
backend/src/
├── config/
│   ├── database.ts               # DB configuration
│   ├── env.ts                    # Environment variables
│   └── constants.ts
│
├── controllers/
│   ├── auth.controller.ts
│   ├── profile.controller.ts
│   ├── event.controller.ts
│   └── stats.controller.ts
│
├── services/
│   ├── auth.service.ts
│   ├── profile.service.ts
│   ├── event.service.ts
│   ├── stats.service.ts
│   ├── seed.service.ts           # Seed generation
│   └── eventGenerator.service.ts # Event generation logic
│
├── models/                       # Business logic models
│   ├── Profile.model.ts
│   └── Event.model.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── errorHandler.middleware.ts
│   ├── rateLimiter.middleware.ts
│   └── logger.middleware.ts
│
├── routes/
│   ├── index.ts                  # Route aggregator
│   ├── auth.routes.ts
│   ├── profile.routes.ts
│   ├── event.routes.ts
│   └── stats.routes.ts
│
├── utils/
│   ├── crypto.utils.ts           # Hashing functions
│   ├── jwt.utils.ts
│   ├── logger.ts
│   └── errors.ts
│
├── validators/
│   ├── auth.validator.ts
│   ├── profile.validator.ts
│   └── event.validator.ts
│
├── scheduler/
│   ├── eventScheduler.ts         # Daily event generator
│   └── jobs.ts
│
├── data/
│   └── eventTemplates.ts         # Event templates
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── app.ts                        # Express app setup
└── server.ts                     # Server entry point
```

### Service Layer Pattern

```typescript
// services/eventGenerator.service.ts
export class EventGeneratorService {
  async generateDailyEvent(profileId: string): Promise<Event> {
    // 1. Profili getir
    const profile = await this.getProfile(profileId);
    
    // 2. Günü hesapla
    const day = this.calculateCurrentDay(profile);
    
    // 3. Deterministik olay üret
    const event = this.generateEvent(profile, day);
    
    // 4. Kaydet
    const saved = await this.saveEvent(event);
    
    // 5. Profil durumunu güncelle
    await this.updateProfileState(profile, event);
    
    return saved;
  }
  
  private generateEvent(profile: Profile, day: number): Event {
    // Deterministik algoritma
    // ...
  }
}
```

### Error Handling

```typescript
// utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}
```

---

## Scheduler Sistemi

### Cron Job Yapısı

```typescript
// scheduler/eventScheduler.ts
import cron from 'node-cron';
import { EventGeneratorService } from '../services/eventGenerator.service';

export class EventScheduler {
  private eventGenerator: EventGeneratorService;
  
  constructor() {
    this.eventGenerator = new EventGeneratorService();
  }
  
  start() {
    // Her gün saat 00:00'da çalış
    cron.schedule('0 0 * * *', async () => {
      console.log('Daily event generation started');
      await this.generateAllEvents();
    });
    
    console.log('Event scheduler initialized');
  }
  
  private async generateAllEvents() {
    try {
      // Aktif profilleri getir
      const activeProfiles = await this.getActiveProfiles();
      
      // Her profil için olay üret
      for (const profile of activeProfiles) {
        try {
          await this.eventGenerator.generateDailyEvent(profile.id);
          console.log(`Event generated for profile ${profile.id}`);
        } catch (error) {
          console.error(`Failed to generate event for ${profile.id}:`, error);
          // Continue with other profiles
        }
      }
      
      console.log(`Generated events for ${activeProfiles.length} profiles`);
    } catch (error) {
      console.error('Daily event generation failed:', error);
    }
  }
  
  private async getActiveProfiles() {
    // Prisma query to get active profiles
    // ...
  }
}
```

### Timezone Handling

```typescript
// Her kullanıcı kendi timezone'unda olay alacak şekilde
function getScheduleTimeForUser(userTimezone: string): string {
  // Kullanıcı timezone'ına göre cron expression oluştur
  // Örnek: UTC+3 için '0 21 * * *' (UTC'de 21:00 = Local'de 00:00)
}
```

---

## AI Hazırlığı

### AI Layer Interface

```typescript
// Gelecek AI entegrasyonu için hazır interface
export interface AIService {
  // Detaylı hikaye üretimi
  generateStory(event: Event, profile: Profile): Promise<AIStory>;
  
  // Duygu analizi
  analyzeSentiment(event: Event): Promise<SentimentAnalysis>;
  
  // Sonraki bölüm tahmini
  predictNextChapter(profile: Profile, history: Event[]): Promise<Prediction>;
  
  // Karakter gelişimi analizi
  analyzeCharacterGrowth(profile: Profile): Promise<GrowthAnalysis>;
}

interface AIStory {
  narrative: string;
  dialogues?: Dialogue[];
  sceneDescription: string;
  emotionalTone: string;
  keywords: string[];
}

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  confidence: number;
}
```

### Veri Yapısı (AI için hazır)

```typescript
// Event'ler AI için gerekli metadata içeriyor
interface EventDetails {
  // Mevcut deterministik data
  category: string;
  tags: string[];
  
  // AI için hazır alanlar
  aiReadyData?: {
    context: string;           // Olay bağlamı
    characters?: string[];     // İlgili karakterler
    location?: string;         // Olay yeri
    timeOfDay?: string;        // Günün saati
    mood?: string;             // Genel atmosfer
    previousEvents?: string[]; // Önceki ilgili olaylar
  };
}
```

### AI Entegrasyon Noktaları

```typescript
// services/ai.service.ts (Gelecek implementasyon)
export class AIService implements IAIService {
  private openaiClient: OpenAI; // veya başka AI provider
  
  async generateStory(event: Event, profile: Profile): Promise<AIStory> {
    const prompt = this.buildStoryPrompt(event, profile);
    const response = await this.openaiClient.complete(prompt);
    return this.parseStoryResponse(response);
  }
  
  private buildStoryPrompt(event: Event, profile: Profile): string {
    return `
      Karakter: ${profile.characterName}
      Özellikler: ${profile.mainTrait}, ${profile.talent}
      Zaaf: ${profile.weakness}
      
      Olay: ${event.title}
      Açıklama: ${event.description}
      
      Bu olay için detaylı bir hikaye oluştur...
    `;
  }
}
```

---

## Güvenlik

### Authentication Flow
1. User registers → Password hashed with bcrypt (salt rounds: 12)
2. User logs in → Credentials validated
3. JWT token issued (expires: 24h)
4. Refresh token issued (expires: 7d)
5. Protected routes validate JWT
6. Token refresh when needed

### Security Best Practices
- SQL Injection: Prevented by Prisma ORM
- XSS: Sanitized inputs with Zod validation
- CSRF: SameSite cookies + CSRF tokens
- Rate Limiting: 100 requests per 15 minutes per IP
- Password Policy: Min 8 chars, uppercase, lowercase, number
- HTTPS only in production

---

## Performans Optimizasyonu

### Database
- Indexed columns: userId, profileId, dayNumber, eventType
- Connection pooling
- Query optimization with Prisma

### Frontend
- Server Components for static content
- Client Components only when needed
- Image optimization with Next.js Image
- Code splitting
- Lazy loading

### Caching Strategy
- API responses: 5 minutes (React Query)
- Static pages: ISR with 60s revalidate
- User session: In-memory + Redis (future)

---

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Environment Variables

**Backend (.env)**:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourapp.com
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourapp.com
```

---

## Monitoring & Logging

### Logging
- Winston logger
- Log levels: error, warn, info, debug
- Separate files for errors
- Daily rotation

### Monitoring (Future)
- Sentry for error tracking
- Prometheus + Grafana for metrics
- Health check endpoint: /api/health

---

## Testing Strategy

### Backend
- Unit tests: Services, utils
- Integration tests: API endpoints
- E2E tests: Critical flows
- Coverage target: 80%

### Frontend
- Unit tests: Components, hooks
- Integration tests: User flows
- E2E tests: Playwright
- Coverage target: 70%

---

## Scalability Plan

### Phase 1 (Current)
- Monolith architecture
- Single server
- Single database

### Phase 2 (Future)
- Separate frontend & backend servers
- Database replication
- Redis caching
- CDN for static assets

### Phase 3 (Future)
- Microservices
- Event-driven architecture
- Message queue (RabbitMQ/Kafka)
- Horizontal scaling

---

Bu mimari dokümantasyonu projenin tüm teknik detaylarını içermektedir. Şimdi kod implementasyonuna geçebiliriz.

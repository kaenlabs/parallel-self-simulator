import { EventType } from '@prisma/client';

export interface EventTemplateData {
  eventType: EventType;
  intensityMin: number;
  intensityMax: number;
  title: string;
  descriptionTemplate: string;
  baseImpact: number;
  tags: string[];
}

export const EVENT_TEMPLATES: EventTemplateData[] = [
  // SUCCESS Events
  {
    eventType: 'SUCCESS',
    intensityMin: 1,
    intensityMax: 3,
    title: 'Küçük Bir Kazanım',
    descriptionTemplate: 'Bugün küçük ama anlamlı bir başarı elde ettin. {dailyGoal} hedefine doğru bir adım attın.',
    baseImpact: 30,
    tags: ['başarı', 'küçük', 'ilerleme'],
  },
  {
    eventType: 'SUCCESS',
    intensityMin: 4,
    intensityMax: 6,
    title: 'Önemli Bir İlerleme',
    descriptionTemplate: 'Bugün {talent} yeteneğini kullanarak önemli bir ilerleme kaydettın. Çevrendekiler bunu fark etti.',
    baseImpact: 60,
    tags: ['başarı', 'orta', 'fark edilme'],
  },
  {
    eventType: 'SUCCESS',
    intensityMin: 7,
    intensityMax: 8,
    title: 'Büyük Başarı',
    descriptionTemplate: 'Harika bir gün! {mainTrait} özelliğin sayesinde beklenmedik bir başarı elde ettin. Bu, yeni fırsatların kapısını açabilir.',
    baseImpact: 85,
    tags: ['başarı', 'büyük', 'fırsat'],
  },
  {
    eventType: 'SUCCESS',
    intensityMin: 9,
    intensityMax: 10,
    title: 'Olağanüstü Zafer',
    descriptionTemplate: 'Bugün inanılmaz bir başarı! Uzun süredir hayalini kurduğun bir şeyi başardın. {characterName} olarak tarihi bir gün yaşadın.',
    baseImpact: 100,
    tags: ['başarı', 'olağanüstü', 'dönüm noktası'],
  },

  // FAILURE Events
  {
    eventType: 'FAILURE',
    intensityMin: 1,
    intensityMax: 3,
    title: 'Küçük Bir Aksaklık',
    descriptionTemplate: 'Bugün planladığın bir şey beklendiği gibi gitmedi. Ama {mainTrait} yapın sayesinde bunu öğrenme fırsatına çevirebilirsin.',
    baseImpact: -25,
    tags: ['hata', 'küçük', 'öğrenme'],
  },
  {
    eventType: 'FAILURE',
    intensityMin: 4,
    intensityMax: 6,
    title: 'Ciddi Bir Hata',
    descriptionTemplate: '{weakness} zaafın bugün kendini gösterdi. Önemli bir konuda hata yaptın ve bunun sonuçlarıyla yüzleşmen gerekiyor.',
    baseImpact: -50,
    tags: ['hata', 'orta', 'sonuç'],
  },
  {
    eventType: 'FAILURE',
    intensityMin: 7,
    intensityMax: 8,
    title: 'Büyük Hayal Kırıklığı',
    descriptionTemplate: 'Bugün çok umutlu olduğun bir konu tamamen ters gitti. Bu, {characterName} için zor bir gün oldu.',
    baseImpact: -70,
    tags: ['hata', 'büyük', 'hayal kırıklığı'],
  },
  {
    eventType: 'FAILURE',
    intensityMin: 9,
    intensityMax: 10,
    title: 'Ağır Bir Darbe',
    descriptionTemplate: 'Bugün gerçekten zor bir gün. Uzun süredir üzerinde çalıştığın bir şey başarısızlıkla sonuçlandı. Ama her zorluk yeni bir başlangıç demek.',
    baseImpact: -90,
    tags: ['hata', 'çok büyük', 'yeniden başlangıç'],
  },

  // SOCIAL Events
  {
    eventType: 'SOCIAL',
    intensityMin: 1,
    intensityMax: 3,
    title: 'Sıradan Bir Sohbet',
    descriptionTemplate: 'Bugün günlük bir sohbet yaptın. Derin olmasa da, {dailyGoal} hedefin için küçük bir katkı sağladı.',
    baseImpact: 15,
    tags: ['sosyal', 'sohbet', 'günlük'],
  },
  {
    eventType: 'SOCIAL',
    intensityMin: 4,
    intensityMax: 6,
    title: 'Anlamlı Bir Bağlantı',
    descriptionTemplate: 'Bugün birisiyle anlamlı bir bağlantı kurdun. {talent} yeteneğin sayesinde derin bir sohbet gerçekleştirdin.',
    baseImpact: 40,
    tags: ['sosyal', 'bağlantı', 'derin'],
  },
  {
    eventType: 'SOCIAL',
    intensityMin: 7,
    intensityMax: 8,
    title: 'Güçlü Bir Dostluk',
    descriptionTemplate: 'Bugün yeni bir dostluk kuruldu ya da mevcut bir ilişkin çok güçlendi. {mainTrait} kişiliğin insanları kendine çekiyor.',
    baseImpact: 65,
    tags: ['sosyal', 'dostluk', 'güçlü'],
  },
  {
    eventType: 'SOCIAL',
    intensityMin: 9,
    intensityMax: 10,
    title: 'Hayat Değiştiren Bir Tanışma',
    descriptionTemplate: 'Bugün hayatını değiştirecek birisiyle tanıştın. Bu tanışma {characterName} için yeni bir dönemin başlangıcı olabilir.',
    baseImpact: 90,
    tags: ['sosyal', 'tanışma', 'dönüm noktası'],
  },

  // FINANCIAL Events
  {
    eventType: 'FINANCIAL',
    intensityMin: 1,
    intensityMax: 3,
    title: 'Küçük Bir Gelir',
    descriptionTemplate: 'Bugün beklenmedik küçük bir gelir elde ettin. Yeterli değil ama mutluluk verici.',
    baseImpact: 20,
    tags: ['maddi', 'küçük', 'gelir'],
  },
  {
    eventType: 'FINANCIAL',
    intensityMin: 4,
    intensityMax: 6,
    title: 'Maddi Bir Fırsat',
    descriptionTemplate: 'Bugün {talent} yeteneğin sayesinde maddi bir fırsat yakaladın. Doğru adımları atarsan büyük kazanç sağlayabilirsin.',
    baseImpact: 50,
    tags: ['maddi', 'fırsat', 'potansiyel'],
  },
  {
    eventType: 'FINANCIAL',
    intensityMin: 7,
    intensityMax: 8,
    title: 'Büyük Bir Kazanç',
    descriptionTemplate: 'Harika! Bugün önemli bir maddi kazanç elde ettin. Bu, {dailyGoal} hedefine ulaşmanda büyük bir adım.',
    baseImpact: 75,
    tags: ['maddi', 'büyük', 'kazanç'],
  },
  {
    eventType: 'FINANCIAL',
    intensityMin: 9,
    intensityMax: 10,
    title: 'Finansal Dönüm Noktası',
    descriptionTemplate: 'İnanılmaz! Bugün hayatını değiştirecek bir finansal fırsat geldi. {characterName} için yeni bir dönem başlıyor.',
    baseImpact: 95,
    tags: ['maddi', 'olağanüstü', 'dönüm noktası'],
  },

  // INTERNAL Events
  {
    eventType: 'INTERNAL',
    intensityMin: 1,
    intensityMax: 3,
    title: 'Küçük Bir Farkındalık',
    descriptionTemplate: 'Bugün kendini daha iyi anladığın bir an yaşadın. {weakness} zaafın hakkında küçük bir içgörü edindin.',
    baseImpact: 10,
    tags: ['içsel', 'farkındalık', 'küçük'],
  },
  {
    eventType: 'INTERNAL',
    intensityMin: 4,
    intensityMax: 6,
    title: 'Derin Bir Düşünce',
    descriptionTemplate: 'Bugün kendini derin düşüncelere daldın. {dailyGoal} hedefin hakkında yeni perspektifler edindin.',
    baseImpact: 30,
    tags: ['içsel', 'düşünce', 'perspektif'],
  },
  {
    eventType: 'INTERNAL',
    intensityMin: 7,
    intensityMax: 8,
    title: 'Güçlü Bir Hissin Anlık',
    descriptionTemplate: 'Bugün güçlü duygular yaşadın. Bu, {characterName} için önemli bir içsel dönüşümün işareti olabilir.',
    baseImpact: 55,
    tags: ['içsel', 'duygu', 'dönüşüm'],
  },
  {
    eventType: 'INTERNAL',
    intensityMin: 9,
    intensityMax: 10,
    title: 'Epifani Anı',
    descriptionTemplate: 'Bugün hayatını değiştiren bir aydınlanma yaşadın! Her şeyi bambaşka görmeye başladın. {mainTrait} özelliğin yeni bir anlam kazandı.',
    baseImpact: 85,
    tags: ['içsel', 'epifani', 'aydınlanma'],
  },

  // IDEA Events
  {
    eventType: 'IDEA',
    intensityMin: 1,
    intensityMax: 3,
    title: 'Küçük Bir İlham',
    descriptionTemplate: 'Bugün küçük ama ilginç bir fikir geldi aklına. Belki ileride işine yarayabilir.',
    baseImpact: 15,
    tags: ['fikir', 'küçük', 'ilham'],
  },
  {
    eventType: 'IDEA',
    intensityMin: 4,
    intensityMax: 6,
    title: 'Yaratıcı Bir Fikir',
    descriptionTemplate: 'Bugün {talent} yeteneğinle birleşen yaratıcı bir fikir gelişti. Bunu hayata geçirmen gerekebilir.',
    baseImpact: 45,
    tags: ['fikir', 'yaratıcı', 'potansiyel'],
  },
  {
    eventType: 'IDEA',
    intensityMin: 7,
    intensityMax: 8,
    title: 'Parlak Bir Fikir',
    descriptionTemplate: 'Harika! Bugün parlak bir fikir geldi. Bu, {dailyGoal} hedefine ulaşmanda devrim yaratabilir.',
    baseImpact: 70,
    tags: ['fikir', 'parlak', 'devrim'],
  },
  {
    eventType: 'IDEA',
    intensityMin: 9,
    intensityMax: 10,
    title: 'Çığır Açan Bir Buluş',
    descriptionTemplate: 'İnanılmaz! Bugün çığır açacak bir fikir geldi aklına. {characterName} için bu fikir her şeyi değiştirebilir!',
    baseImpact: 95,
    tags: ['fikir', 'çığır açan', 'dönüm noktası'],
  },

  // CONFLICT Events
  {
    eventType: 'CONFLICT',
    intensityMin: 1,
    intensityMax: 3,
    title: 'Küçük Bir Anlaşmazlık',
    descriptionTemplate: 'Bugün biriyle küçük bir anlaşmazlık yaşadın. {weakness} zaafın biraz devreye girdi ama büyümedi.',
    baseImpact: -20,
    tags: ['çatışma', 'küçük', 'anlaşmazlık'],
  },
  {
    eventType: 'CONFLICT',
    intensityMin: 4,
    intensityMax: 6,
    title: 'Ciddi Bir Tartışma',
    descriptionTemplate: 'Bugün ciddi bir tartışma yaşadın. Bu durum seni yordu ve {dailyGoal} hedefinden biraz uzaklaştı.',
    baseImpact: -45,
    tags: ['çatışma', 'tartışma', 'yorgunluk'],
  },
  {
    eventType: 'CONFLICT',
    intensityMin: 7,
    intensityMax: 8,
    title: 'Büyük Bir Çatışma',
    descriptionTemplate: 'Bugün önemli biriyle büyük bir çatışma yaşadın. {characterName} için bu oldukça zor bir gün oldu.',
    baseImpact: -70,
    tags: ['çatışma', 'büyük', 'zor'],
  },
  {
    eventType: 'CONFLICT',
    intensityMin: 9,
    intensityMax: 10,
    title: 'Yıkıcı Bir Kriz',
    descriptionTemplate: 'Bugün çok zor bir çatışma yaşadın. Bu kriz {characterName} için büyük bir sınav. Ama güçlü kalırsan bundan daha güçlü çıkabilirsin.',
    baseImpact: -85,
    tags: ['çatışma', 'kriz', 'sınav'],
  },
];

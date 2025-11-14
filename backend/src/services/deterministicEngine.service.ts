import { Profile } from '@prisma/client';
import { EventType } from '../types/enums';
import {
  TRAIT_MODIFIERS,
  WEAKNESS_MODIFIERS,
  TALENT_MODIFIERS,
  EVENT_BASE_IMPACT,
  PRIME_NUMBER,
  EVENT_TYPES,
} from '../config/constants';
import { seedToNumber, deterministicRandom } from '../utils/crypto.utils';

export class DeterministicEngine {
  /**
   * Belirli bir gün için olay tipini deterministik olarak belirler
   */
  static determineEventType(seed: string, dayNumber: number): EventType {
    const seedNum = seedToNumber(seed, 0, 8);
    const combined = seedNum + dayNumber * PRIME_NUMBER;
    const typeIndex = combined % 7;
    return EVENT_TYPES[typeIndex] as EventType;
  }

  /**
   * Olay yoğunluğunu hesaplar (1-10)
   */
  static calculateIntensity(profile: Profile, dayNumber: number, eventType: EventType): number {
    // Base intensity from seed
    const baseIntensity = seedToNumber(profile.seed, 8, 8) % 10 + 1;

    // Trait modifier
    const traitMod = this.getTraitModifier(profile, eventType);

    // Day pattern (sinüs dalgası ile periyodik değişim)
    const dayPattern = Math.sin(dayNumber / 7) * 2;

    // Final intensity
    let intensity = baseIntensity + traitMod + dayPattern;

    // Clamp to 1-10
    return Math.max(1, Math.min(10, Math.round(intensity)));
  }

  /**
   * Özellik modifierlarını hesaplar
   */
  private static getTraitModifier(profile: Profile, eventType: EventType): number {
    const mainTraitKey = profile.mainTrait.toLowerCase() as keyof typeof TRAIT_MODIFIERS;
    const weaknessKey = profile.weakness.toLowerCase() as keyof typeof WEAKNESS_MODIFIERS;
    const talentKey = profile.talent.toLowerCase() as keyof typeof TALENT_MODIFIERS;

    const mainTraitMod = TRAIT_MODIFIERS[mainTraitKey]?.[eventType] || 0;
    const weaknessMod = WEAKNESS_MODIFIERS[weaknessKey]?.[eventType] || 0;
    const talentMod = TALENT_MODIFIERS[talentKey]?.[eventType] || 0;

    return mainTraitMod + weaknessMod * 0.7 + talentMod * 0.8;
  }

  /**
   * Etki puanını hesaplar (-100 to +100)
   */
  static calculateImpact(profile: Profile, eventType: EventType, intensity: number): number {
    const baseImpact = EVENT_BASE_IMPACT[eventType];

    // Intensity multiplier (0.2 to 2.0)
    const intensityMultiplier = intensity / 5;

    // Trait synergy bonus
    const synergyBonus = this.calculateSynergyBonus(profile, eventType);

    // Day streak modifier
    const streakModifier = this.calculateStreakModifier(profile);

    // Final impact
    const impact = baseImpact * intensityMultiplier + synergyBonus + streakModifier;

    // Clamp to -100 to +100
    return Math.max(-100, Math.min(100, Math.round(impact)));
  }

  /**
   * Özellikler arası sinerji bonusu
   */
  private static calculateSynergyBonus(profile: Profile, eventType: EventType): number {
    // Pozitif sinerjiler
    const synergies: Record<string, { traits: string[]; bonus: number }> = {
      'cesur-liderlik-başarı': {
        traits: ['cesur', 'liderlik'],
        bonus: 15,
      },
      'yaratıcı-sanat-fikir': {
        traits: ['yaratıcı', 'sanat'],
        bonus: 20,
      },
      'analitik-teknoloji-fikir': {
        traits: ['analitik', 'teknoloji'],
        bonus: 18,
      },
      'sosyal-iletişim-sosyal': {
        traits: ['sosyal', 'iletişim'],
        bonus: 15,
      },
      'hırslı-liderlik-başarı': {
        traits: ['hırslı', 'liderlik'],
        bonus: 20,
      },
    };

    let bonus = 0;

    const profileTraits = [
      profile.mainTrait.toLowerCase(),
      profile.talent.toLowerCase(),
    ];

    for (const [key, synergy] of Object.entries(synergies)) {
      const eventTypeKey = key.split('-')[2];
      if (eventTypeKey === eventType.toLowerCase()) {
        const hasAllTraits = synergy.traits.every((trait) =>
          profileTraits.includes(trait)
        );
        if (hasAllTraits) {
          bonus += synergy.bonus;
        }
      }
    }

    return bonus;
  }

  /**
   * Streak modifierı hesaplar
   */
  private static calculateStreakModifier(_profile: Profile): number {
    // Pozitif streak varsa bonus, negatif streak varsa malus
    // Bu bilgi profile.stats'tan gelecek
    return 0; // Şimdilik basit tutalım
  }

  /**
   * Şablon seçimi için deterministik index
   */
  static selectTemplateIndex(seed: string, dayNumber: number, templateCount: number): number {
    const random = deterministicRandom(seed, dayNumber);
    return Math.floor(random * templateCount);
  }

  /**
   * Açıklama şablonunu doldurur
   */
  static fillTemplate(template: string, profile: Profile): string {
    return template
      .replace(/{characterName}/g, profile.characterName)
      .replace(/{mainTrait}/g, profile.mainTrait)
      .replace(/{weakness}/g, profile.weakness)
      .replace(/{talent}/g, profile.talent)
      .replace(/{dailyGoal}/g, profile.dailyGoal);
  }

  /**
   * Olay kategorisini belirler (POSITIVE, NEGATIVE, NEUTRAL)
   */
  static determineCategory(impactScore: number): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    if (impactScore > 20) return 'POSITIVE';
    if (impactScore < -20) return 'NEGATIVE';
    return 'NEUTRAL';
  }
}

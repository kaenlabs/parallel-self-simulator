import crypto from 'crypto';

/**
 * SHA-256 hash fonksiyonu
 */
export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Seed üretimi için özel hash
 */
export function generateProfileSeed(
  mainTrait: string,
  weakness: string,
  talent: string,
  dailyGoal: string,
  characterName: string
): string {
  const combined = [mainTrait, weakness, talent, dailyGoal, characterName]
    .join('|')
    .toLowerCase()
    .trim();

  return hashString(combined);
}

/**
 * Seed'den belirli bir aralıkta sayı üretir
 */
export function seedToNumber(seed: string, start: number, length: number): number {
  const substr = seed.substring(start, start + length);
  return parseInt(substr, 16);
}

/**
 * Deterministik rastgele sayı üretir (0-1 arası)
 */
export function deterministicRandom(seed: string, salt: number): number {
  const combined = seed + salt.toString();
  const hash = hashString(combined);
  const num = parseInt(hash.substring(0, 8), 16);
  return num / 0xffffffff; // Normalize to 0-1
}

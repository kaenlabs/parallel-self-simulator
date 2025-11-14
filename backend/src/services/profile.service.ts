import { Profile, ProfileStatus } from '@prisma/client';
import prisma from '../config/database';
import { generateProfileSeed } from '../utils/crypto.utils';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors';
import logger from '../utils/logger';

export interface CreateProfileInput {
  userId: string;
  characterName: string;
  mainTrait: string;
  weakness: string;
  talent: string;
  dailyGoal: string;
}

export interface UpdateProfileInput {
  characterName?: string;
  mainTrait?: string;
  weakness?: string;
  talent?: string;
  dailyGoal?: string;
  status?: ProfileStatus;
}

export class ProfileService {
  /**
   * Yeni profil oluştur
   */
  async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { userId, characterName, mainTrait, weakness, talent, dailyGoal } = input;

    // Kullanıcı kontrolü
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.profile) {
      throw new ConflictError('User already has a profile');
    }

    // Seed üret
    const seed = generateProfileSeed(mainTrait, weakness, talent, dailyGoal, characterName);

    // Profil oluştur
    const profile = await prisma.profile.create({
      data: {
        userId,
        characterName,
        mainTrait,
        weakness,
        talent,
        dailyGoal,
        seed,
      },
    });

    // Başlangıç istatistikleri oluştur
    await prisma.profileStats.create({
      data: {
        profileId: profile.id,
      },
    });

    logger.info(`Profile created: ${profile.id} for user ${userId}`);

    return profile;
  }

  /**
   * Profil getir
   */
  async getProfile(profileId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { id: profileId },
    });
  }

  /**
   * Kullanıcıya göre profil getir
   */
  async getProfileByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  /**
   * İstatistiklerle birlikte profil getir
   */
  async getProfileWithStats(profileId: string) {
    return prisma.profile.findUnique({
      where: { id: profileId },
      include: { stats: true },
    });
  }

  /**
   * Profil güncelle
   */
  async updateProfile(profileId: string, userId: string, input: UpdateProfileInput): Promise<Profile> {
    // Profil sahibi kontrolü
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenError('You can only update your own profile');
    }

    // Eğer temel özellikler değişiyorsa seed'i yeniden hesapla
    let newSeed = profile.seed;
    if (
      input.mainTrait ||
      input.weakness ||
      input.talent ||
      input.dailyGoal ||
      input.characterName
    ) {
      newSeed = generateProfileSeed(
        input.mainTrait || profile.mainTrait,
        input.weakness || profile.weakness,
        input.talent || profile.talent,
        input.dailyGoal || profile.dailyGoal,
        input.characterName || profile.characterName
      );
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...input,
        seed: newSeed,
      },
    });

    logger.info(`Profile updated: ${profileId}`);

    return updatedProfile;
  }

  /**
   * Profili sil
   */
  async deleteProfile(profileId: string, userId: string): Promise<void> {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenError('You can only delete your own profile');
    }

    await prisma.profile.delete({
      where: { id: profileId },
    });

    logger.info(`Profile deleted: ${profileId}`);
  }

  /**
   * Profili duraklat
   */
  async pauseProfile(profileId: string, userId: string): Promise<Profile> {
    return this.updateProfile(profileId, userId, { status: 'PAUSED' });
  }

  /**
   * Profili devam ettir
   */
  async resumeProfile(profileId: string, userId: string): Promise<Profile> {
    return this.updateProfile(profileId, userId, { status: 'ACTIVE' });
  }

  /**
   * Aktif profilleri getir (scheduler için)
   */
  async getActiveProfiles(): Promise<Profile[]> {
    return prisma.profile.findMany({
      where: { status: 'ACTIVE' },
    });
  }
}

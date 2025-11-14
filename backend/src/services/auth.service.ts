import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import { ConflictError, UnauthorizedError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

const SALT_ROUNDS = 12;

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Kullanıcı kaydı
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, name } = input;

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Şifre hash
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    logger.info(`User registered: ${user.id} - ${user.email}`);

    // Token üret
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // PasswordHash'i çıkar
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Kullanıcı girişi
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.info(`User logged in: ${user.id} - ${user.email}`);

    // Token üret
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Kullanıcı bilgilerini getir
   */
  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Token yenileme
   */
  async refreshTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return { accessToken, refreshToken };
  }
}

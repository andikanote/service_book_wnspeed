import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const email = loginDto.email.trim().toLowerCase();

    // 1. Find user strictly by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        racerProfile: {
          include: {
            bikes: {
              include: { diagnostics: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email tidak terdaftar');
    }

    // 2. Validate password
    let isPasswordValid = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    } else {
      // Fallback for plain-text seed data if any
      isPasswordValid = user.password === loginDto.password;
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password yang Anda masukkan salah');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        racerUuid: user.racerUuid,
        joinedAt: user.joinedAt,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        racerProfile: user.racerProfile,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        racerProfile: {
          include: {
            bikes: {
              include: { diagnostics: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Sesi tidak valid atau Pengguna tidak ditemukan');
    }

    return {
      id: user.id,
      racerUuid: user.racerUuid,
      joinedAt: user.joinedAt,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      racerProfile: user.racerProfile,
    };
  }
}

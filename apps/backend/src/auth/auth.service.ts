import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const identifier = loginDto.identifier.trim().toLowerCase();

    // 1. Try to find user in database
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: { equals: identifier, mode: 'insensitive' } },
        ],
      },
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

    // 2. If not found yet, auto-create/resolve for demo purposes or standard flow
    if (!user) {
      const isStaffOrAdmin =
        (identifier.includes('admin') || identifier.includes('staff')) &&
        !identifier.includes('racer');

      const role: Role = isStaffOrAdmin ? 'admin' : 'racer';
      const defaultName = isStaffOrAdmin
        ? 'Workshop Chief Admin'
        : identifier
            .split('@')[0]
            .split(/[._-]/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

      const hashedPassword = await bcrypt.hash(loginDto.password || 'password123', 10);

      try {
        user = await this.prisma.user.create({
          data: {
            email: identifier.includes('@') ? identifier : `${identifier}@artnspeed.id`,
            password: hashedPassword,
            name: defaultName,
            role: role,
            phone: '+62 812-8899-7733',
            racerProfile:
              role === 'racer'
                ? {
                    create: {
                      racerIdCode: `AX-${Math.floor(1000 + Math.random() * 9000)}`,
                      tier: 'ELITE_MEMBER',
                      points: 12450,
                      totalSpent: 14850000,
                      visits: 12,
                      bikes: {
                        create: {
                          model: 'Yamaha All New Aerox 155 Connected',
                          plateNumber: 'B 4992 ELA',
                          year: 2023,
                          mileage: 8450,
                          engineSpec: '155cc VVA + TDR 62mm Ceramic Cylinder (183cc Kit)',
                          ecuMapping: 'aRacer SpeedTek Super X - ART Racing Map v4',
                          dynoHp: 21.8,
                          dynoTorque: 18.2,
                          diagnostics: {
                            create: {
                              oilHealth: 65,
                              vbeltCond: 88,
                              brakePads: 15,
                              batteryVoltage: 12.8,
                              tirePressureFront: 29.5,
                              tirePressureRear: 33.0,
                              afrRatio: 12.9,
                              engineTemp: 86,
                              lastUpdated: '2H AGO',
                            },
                          },
                        },
                      },
                    },
                  }
                : undefined,
          },
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
      } catch (err) {
        console.error('Error auto-provisioning user:', err);
      }
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      racerProfile: user.racerProfile,
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'WE_N_SPEED_SUPER_SECRET_KEY_2026_JWT',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { racerProfile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or session expired');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      racerProfile: user.racerProfile,
    };
  }
}

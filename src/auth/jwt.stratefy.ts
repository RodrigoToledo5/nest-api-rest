import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private entityManager: EntityManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { id } = payload;
    try {
      const userRestaurant = await this.entityManager.findOne(Restaurant, {
        where: { id },
      });

      if (!userRestaurant) {
        throw new UnauthorizedException('Login first to access this resource.');
      }
      return userRestaurant;
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import APIFeatures from 'src/api features/apiFeature.utils';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Exctractor } from 'src/exctractor/entities/exctractor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}
  async restaurant(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const restaurant = await this.entityManager.findOne(Restaurant, {
      where: { email },
    });

    if (!restaurant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, restaurant.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await APIFeatures.assignJwtToken(
      restaurant.id.toString(),
      this.jwtService,
    );

    return { token: token };
  }

  async user(email: string, password: string): Promise<{ token: string }> {
    const user = await this.entityManager.findOne(User, {
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await APIFeatures.assignJwtToken(
      user.id.toString(),
      this.jwtService,
    );

    return { token: token };
  }

  async extractor(email: string, password: string): Promise<{ token: string }> {
    const exctractor = await this.entityManager.findOne(Exctractor, {
      where: { email },
    });

    if (!exctractor) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, exctractor.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await APIFeatures.assignJwtToken(
      exctractor.id.toString(),
      this.jwtService,
    );

    return { token: token };
  }
}

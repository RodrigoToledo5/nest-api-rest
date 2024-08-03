// restaurant.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { Image } from '../image/image.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.stratefy';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    TypeOrmModule.forFeature([Restaurant, Image, User]),
  ],
  controllers: [RestaurantController],
  providers: [JwtStrategy, RestaurantService, AuthService],
  exports: [RestaurantService],
})
export class RestaurantModule {}

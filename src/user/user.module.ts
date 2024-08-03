import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.stratefy';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    TypeOrmModule.forFeature([Restaurant, User]),
  ],
  controllers: [UserController],
  providers: [JwtStrategy, UserService, RestaurantService],
})
export class UserModule {}

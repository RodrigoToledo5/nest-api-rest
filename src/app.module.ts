import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RestaurantService } from './restaurant/restaurant.service';
import { RestaurantController } from './restaurant/restaurant.controller';
import { RestaurantModule } from './restaurant/restaurant.module';
import { Restaurant } from './restaurant/restaurant.entity';
import { CommandModule } from 'nestjs-command';
import { RestaurantCommand } from './commands/restaurant.command';
import { ResetDatabaseCommand } from './commands/reset-database.command';
import { Image } from './image/image.entity';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from './auth/auth.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.stratefy';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { ExctractorModule } from './exctractor/exctractor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'tuffi.db.elephantsql.com',
      port: 5432,
      username: 'ttckomiz',
      password: '1VCIME5LifN0pqiCDSck0dUo30Mivnr7',
      database: 'ttckomiz',
      entities: [Restaurant, Image, User],
      synchronize: true,
    }),
    RestaurantModule,
    CommandModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configuración de Passport
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
    UserModule,
    ExctractorModule,
  ],
  controllers: [
    AppController,
    RestaurantController,
    AuthController,
    UserController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
    AppService,
    RestaurantService,
    AuthService,
    RestaurantCommand,
    ResetDatabaseCommand,
    JwtStrategy,
    UserService,
  ],
})
export class AppModule {}

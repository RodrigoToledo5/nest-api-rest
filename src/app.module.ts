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
      type: process.env.DB_TYPE as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mongodb' | 'oracle', // Especifica los tipos de bases de datos posibles
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432, // Convierte el puerto a número
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Restaurant, Image, User],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
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

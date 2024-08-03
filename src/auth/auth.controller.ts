import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('restaurant')
  async restaurant(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ token: string }> {
    try {
      const restaurant = await this.authService.restaurant(
        credentials.email,
        credentials.password,
      );
      return restaurant;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('user')
  async user(
    @Body() credentials: { email: string; password: string },
  ): Promise<{ token: string }> {
    try {
      const restaurant = await this.authService.user(
        credentials.email,
        credentials.password,
      );
      return restaurant;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}

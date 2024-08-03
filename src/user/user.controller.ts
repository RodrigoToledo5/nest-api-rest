import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly restaurantService: RestaurantService,
  ) {}

  @Post()
  create(@Body() user: User): Promise<{ token: string }> {
    return this.userService.create(user);
  }

  @Get()
  findAll(@Query() query: ExpressQuery): Promise<User[]> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedUser: User): Promise<User> {
    return this.userService.update(parseInt(id, 10), updatedUser);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<User> {
    return this.userService.setHiddenStatus(+id, true);
  }

  @Post('restaurant/:id')
  async createRestaruant(
    @Param('id') id: number,
    @Body() restaurant: Restaurant,
  ): Promise<User> {
    const newRestaruant = await this.restaurantService.create(restaurant);

    await this.userService.addRestaruantTo(id, newRestaruant.id);

    return await this.userService.findOne(id);
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.entity';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(parseInt(id, 10));
  }

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() restaurant: Restaurant): Promise<Restaurant> {
    return this.restaurantService.create(restaurant);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  update(
    @Param('id') id: string,
    @Body() updatedRestaurant: Restaurant,
  ): Promise<Restaurant> {
    return this.restaurantService.update(parseInt(id, 10), updatedRestaurant);
  }

  @Post('upload/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantService.findOne(id);

    const res = await this.restaurantService.uploadImages(id, files);

    return res;
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteRestaruant(
    @Param('id')
    id: number,
  ): Promise<{ deleted: boolean }> {
    const restaruant = await this.restaurantService.findOne(id);

    const isDeleted = await this.restaurantService.deleteImages(
      restaruant.images,
    );

    if (isDeleted) {
      this.restaurantService.deleteById(id);
      return {
        deleted: true,
      };
    } else {
      return {
        deleted: false,
      };
    }
  }
}

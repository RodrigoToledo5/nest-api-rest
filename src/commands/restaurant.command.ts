import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Injectable()
export class RestaurantCommand {
  constructor(
    private readonly restaurantService: RestaurantService,
    @InjectEntityManager()
    private readonly dataSource: DataSource,
  ) {}

  @Command({
    command: 'create:restaurant <restaurantname>',
    describe:
      'npx nestjs-command create:restaurant <restaurantname> for create a restaurant',
  })
  async create(
    @Positional({
      name: 'restaurantname',
      describe: 'the restaurant name',
      type: 'string',
    })
    restaurantname: string,
  ) {
    try {
      const newrestaurant = new Restaurant();
      newrestaurant.name = restaurantname;
      newrestaurant.email = restaurantname + '@' + restaurantname + '.com';
      const hashedPassword = await bcrypt.hash('000000', 10);
      newrestaurant.password = hashedPassword;

      await this.dataSource.transaction(async (manager) => {
        const client = await this.restaurantService.create(
          newrestaurant,
          manager,
        );
        console.log('Your new restaurant created:', client);
      });
    } catch (error) {
      console.error('Unable to create restaurant.');
      console.error(error);
    }
  }
}

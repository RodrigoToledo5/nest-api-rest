import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Image } from 'src/image/image.entity';

@Entity()
@Unique(['email'])
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  hidden: boolean;

  @OneToMany(() => Image, (image) => image.restaurant, { cascade: true })
  @Exclude()
  images: Image[];

  @ManyToOne(() => User, (user) => user.restaurants)
  user: User;
}

import { Query } from 'express-serve-static-core';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  async findAll(query: Query): Promise<Restaurant[]> {
    const keyword: string = query.keyword as string;
    const queryBuilder = this.createQueryBuilder('restaurant');

    if (keyword) {
      queryBuilder.where('restaurant.name ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    return await queryBuilder.getMany();
  }
}

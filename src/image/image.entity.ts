// image.entity.ts
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  key: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.images)
  @Exclude()
  restaurant: Restaurant;

  @ManyToOne(() => User, (user) => user.images)
  @Exclude()
  user: User;
}

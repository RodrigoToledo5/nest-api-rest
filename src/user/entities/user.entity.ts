import { Exclude } from 'class-transformer';
import { Image } from 'src/image/image.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
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

  @OneToMany(() => Image, (image) => image.user, { cascade: true })
  @Exclude()
  images: Image[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user, {
    cascade: true,
  })
  restaurants: Restaurant[];
}

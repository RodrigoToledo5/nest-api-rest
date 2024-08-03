import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { EntityManager, Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import APIFeatures from 'src/api features/apiFeature.utils';
import { Query } from 'express-serve-static-core';
import { Restaurant } from 'src/restaurant/restaurant.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}
  async create(
    user: User,
    manager?: EntityManager,
  ): Promise<{ token: string }> {
    const entityManager = manager ?? this.entityManager;
    const newUser = new User();

    newUser.email = user.email;
    newUser.name = user.name;
    newUser.password = await bcrypt.hash(user.password, 10);

    await entityManager.save(newUser);
    const token = await APIFeatures.assignJwtToken(
      newUser.id.toString(),
      this.jwtService,
    );

    return { token };
  }

  async findAll(query: Query): Promise<User[]> {
    const keyword: string = query.keyword as string;
    const restPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = restPerPage * (currentPage - 1);

    switch (true) {
      case Boolean(keyword && query.page):
        const resultKeywordPage = await this.entityManager.find(User, {
          where: {
            name: Like(`%${keyword}%`),
          },
          select: ['id', 'name', 'email'],
          skip: skip,
          take: restPerPage,
        });

        if (resultKeywordPage.length === 0) {
          throw new NotFoundException(
            `Restaruants has not founded in ${currentPage} pages with the keyword '${keyword}'.`,
          );
        }

        return resultKeywordPage;

      case Boolean(keyword):
        const resultKeyword = await this.entityManager.find(User, {
          where: {
            name: Like(`%${keyword}%`),
          },
          select: ['id', 'name', 'email'],
        });

        if (resultKeyword.length === 0) {
          throw new NotFoundException(`Not found keyword'${keyword}'.`);
        }

        return resultKeyword;

      case Boolean(query.page):
        const resultPage = await this.entityManager.find(User, {
          skip: skip,
          take: restPerPage,
          select: ['id', 'name', 'email'],
        });

        if (resultPage.length === 0) {
          throw new NotFoundException(
            `Not restaruants in page ${currentPage}.`,
          );
        }

        return resultPage;

      default:
        const resultDefault = await this.entityManager.find(User, {
          select: ['id', 'name', 'email'],
        });

        if (resultDefault.length === 0) {
          throw new NotFoundException('Not found');
        }

        return resultDefault;
    }
  }

  async findOne(id: number): Promise<User> {
    const restaurant = await this.entityManager.findOne(User, {
      where: { id },
      relations: ['images', 'restaurants'],
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        hidden: true,
        restaurants: {
          id: true,
          name: true,
          email: true,
          password: false,
          images: true,
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaruant not found');
    }

    return restaurant;
  }

  async update(
    id: number,
    updatedRestaurant: User,
    manager?: EntityManager,
  ): Promise<User> {
    const entityManager = manager ?? this.entityManager;

    await entityManager.update(User, id, updatedRestaurant);

    const user = await entityManager.findOne(User, {
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Restaurant width id: ${id} not found`);
    }

    return user;
  }

  async setHiddenStatus(
    id: number,
    newHiddenStatus: boolean,
    manager?: EntityManager,
  ): Promise<User> {
    const entityManager = manager || this.entityManager;

    try {
      const existingUser = await entityManager.findOne(User, {
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (existingUser.hidden !== newHiddenStatus) {
        existingUser.hidden = newHiddenStatus;
        await entityManager.save(User, existingUser);
      }

      return existingUser;
    } catch (error) {
      throw new NotFoundException(`${error}`);
    }
  }

  async addRestaruantTo(
    id: number,
    restaruantId: number,
    manager?: EntityManager,
  ): Promise<User> {
    const entityManager = manager || this.entityManager;

    try {
      const existingUser = await entityManager.findOne(User, {
        where: { id },
        relations: ['restaurants'],
        select: {
          id: true,
          name: true,
          email: true,
          password: false,
          hidden: true,
        },
      });

      const existingRestaurant = await entityManager.findOne(Restaurant, {
        where: { id: restaruantId },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (!existingRestaurant) {
        throw new NotFoundException(`Restaruant with id ${id} not found`);
      }

      existingUser.restaurants.push(existingRestaurant);

      const updatedUser: User = await entityManager.save(User, existingUser);

      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`${error}`);
    }
  }
}

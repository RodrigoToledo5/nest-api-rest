import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { EntityManager, Like } from 'typeorm';
import { Query } from 'express-serve-static-core';
import APIFeatures from 'src/api features/apiFeature.utils';
import { Image } from 'src/image/image.entity';
import { S3 } from 'aws-sdk';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async findAll(query: Query): Promise<Restaurant[]> {
    const keyword: string = query.keyword as string;
    const restPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = restPerPage * (currentPage - 1);

    switch (true) {
      case Boolean(keyword && query.page):
        const resultKeywordPage = await this.entityManager.find(Restaurant, {
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
        const resultKeyword = await this.entityManager.find(Restaurant, {
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
        const resultPage = await this.entityManager.find(Restaurant, {
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
        const resultDefault = await this.entityManager.find(Restaurant, {
          select: ['id', 'name', 'email'],
        });

        if (resultDefault.length === 0) {
          throw new NotFoundException('Not found');
        }

        return resultDefault;
    }
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.entityManager.findOne(Restaurant, {
      where: { id, user: { hidden: false } },
      relations: ['images', 'user'],
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        user: {
          id: true,
          name: true,
          email: true,
          password: false,
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaruant not found');
    }

    return restaurant;
  }

  async create(user: Restaurant, manager?: EntityManager): Promise<Restaurant> {
    try {
      const entityManager = manager ?? this.entityManager;
      const restaurant = new Restaurant();

      restaurant.email = user.email;
      restaurant.name = user.name;
      restaurant.password = await bcrypt.hash(user.password, 10);
      return await entityManager.save(restaurant);
    } catch (error) {
      throw new NotFoundException(`${error}`);
    }
  }

  async update(
    id: number,
    updatedRestaurant: Restaurant,
    manager?: EntityManager,
  ): Promise<Restaurant> {
    const entityManager = manager ?? this.entityManager;

    await entityManager.update(Restaurant, id, updatedRestaurant);

    const restaurant = await entityManager.findOne(Restaurant, {
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant width id: ${id} not found`);
    }

    return restaurant;
  }

  async deleteById(id: number, manager?: EntityManager): Promise<void> {
    const entityManager = manager || this.entityManager;

    const restaurant = await entityManager.findOne(Restaurant, {
      where: { id },
      relations: ['images'],
    });

    if (!restaurant) {
      throw new NotFoundException(`ID ${id} not found`);
    }
    if (restaurant.images && restaurant.images.length > 0) {
      // Puedes ajustar esta lógica según tus necesidades (por ejemplo, manejar las imágenes de manera especial)
      await entityManager.remove(restaurant.images);
    }
    await entityManager.delete(Restaurant, { id });
    // await entityManager.remove(restaurant);
  }

  async uploadImages(id: number, files: Express.Multer.File[]) {
    const images = (await APIFeatures.upload(
      files,
    )) as S3.ManagedUpload.SendData[];

    const toUpdate = await this.entityManager.findOne(Restaurant, {
      where: { id },
      relations: ['images'],
    });

    if (!toUpdate) {
      throw new NotFoundException(`ID ${id} not found`);
    }

    const newImages = images.map((image) => {
      const newImage = new Image();
      newImage.location = image.Location;
      newImage.restaurant = toUpdate;
      newImage.key = image.Key;
      return newImage;
    });

    toUpdate.images = [...(toUpdate.images || []), ...newImages];

    await this.entityManager.save(Restaurant, toUpdate);

    return await this.entityManager.findOne(Restaurant, {
      where: { id },
      relations: ['images'],
    });
  }
  async deleteImages(images) {
    const res = await APIFeatures.deleteImages(images);
    return res;
  }

  async setHiddenStatus(
    id: number,
    newHiddenStatus: boolean,
    manager?: EntityManager,
  ): Promise<Restaurant> {
    const entityManager = manager || this.entityManager;

    try {
      const existingRestaurant = await entityManager.findOne(Restaurant, {
        where: { id },
      });

      if (!existingRestaurant) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (existingRestaurant.hidden !== newHiddenStatus) {
        existingRestaurant.hidden = newHiddenStatus;
        await entityManager.save(Restaurant, existingRestaurant);
      }

      return existingRestaurant;
    } catch (error) {
      throw new NotFoundException(`${error}`);
    }
  }
}

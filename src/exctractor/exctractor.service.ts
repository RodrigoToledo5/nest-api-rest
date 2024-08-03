import { Injectable } from '@nestjs/common';
import { CreateExctractorDto } from './dto/create-exctractor.dto';
import { UpdateExctractorDto } from './dto/update-exctractor.dto';

@Injectable()
export class ExctractorService {
  create(createExctractorDto: CreateExctractorDto) {
    return 'This action adds a new exctractor';
  }

  findAll() {
    return `This action returns all exctractor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exctractor`;
  }

  update(id: number, updateExctractorDto: UpdateExctractorDto) {
    return `This action updates a #${id} exctractor`;
  }

  remove(id: number) {
    return `This action removes a #${id} exctractor`;
  }
}

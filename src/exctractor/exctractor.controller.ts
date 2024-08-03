import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExctractorService } from './exctractor.service';
import { CreateExctractorDto } from './dto/create-exctractor.dto';
import { UpdateExctractorDto } from './dto/update-exctractor.dto';

@Controller('exctractor')
export class ExctractorController {
  constructor(private readonly exctractorService: ExctractorService) {}

  @Post()
  create(@Body() createExctractorDto: CreateExctractorDto) {
    return this.exctractorService.create(createExctractorDto);
  }

  @Get()
  findAll() {
    return this.exctractorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exctractorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExctractorDto: UpdateExctractorDto,
  ) {
    return this.exctractorService.update(+id, updateExctractorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exctractorService.remove(+id);
  }
}

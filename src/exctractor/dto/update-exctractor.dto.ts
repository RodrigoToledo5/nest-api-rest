import { PartialType } from '@nestjs/mapped-types';
import { CreateExctractorDto } from './create-exctractor.dto';

export class UpdateExctractorDto extends PartialType(CreateExctractorDto) {}

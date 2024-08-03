import { Module } from '@nestjs/common';
import { ExctractorService } from './exctractor.service';
import { ExctractorController } from './exctractor.controller';

@Module({
  controllers: [ExctractorController],
  providers: [ExctractorService],
})
export class ExctractorModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { ExctractorController } from './exctractor.controller';
import { ExctractorService } from './exctractor.service';

describe('ExctractorController', () => {
  let controller: ExctractorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExctractorController],
      providers: [ExctractorService],
    }).compile();

    controller = module.get<ExctractorController>(ExctractorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

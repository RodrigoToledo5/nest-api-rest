import { Test, TestingModule } from '@nestjs/testing';
import { ExctractorService } from './exctractor.service';

describe('ExctractorService', () => {
  let service: ExctractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExctractorService],
    }).compile();

    service = module.get<ExctractorService>(ExctractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

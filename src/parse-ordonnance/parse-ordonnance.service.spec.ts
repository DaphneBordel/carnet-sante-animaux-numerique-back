import { Test, TestingModule } from '@nestjs/testing';
import { ParseOrdonnanceService } from './parse-ordonnance.service';

describe('ParseOrdonnanceService', () => {
  let service: ParseOrdonnanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseOrdonnanceService],
    }).compile();

    service = module.get<ParseOrdonnanceService>(ParseOrdonnanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

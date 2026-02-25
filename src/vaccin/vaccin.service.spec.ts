import { Test, TestingModule } from '@nestjs/testing';
import { VaccinService } from './vaccin.service';

describe('VaccinService', () => {
  let service: VaccinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaccinService],
    }).compile();

    service = module.get<VaccinService>(VaccinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

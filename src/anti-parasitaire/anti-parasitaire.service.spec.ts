import { Test, TestingModule } from '@nestjs/testing';
import { AntiParasitaireService } from './anti-parasitaire.service';

describe('AntiParasitaireService', () => {
  let service: AntiParasitaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntiParasitaireService],
    }).compile();

    service = module.get<AntiParasitaireService>(AntiParasitaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

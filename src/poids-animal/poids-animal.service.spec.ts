import { Test, TestingModule } from '@nestjs/testing';
import { PoidsAnimalService } from './poids-animal.service';

describe('PoidsAnimalService', () => {
  let service: PoidsAnimalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoidsAnimalService],
    }).compile();

    service = module.get<PoidsAnimalService>(PoidsAnimalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AntiParasitaireController } from './anti-parasitaire.controller';

describe('AntiParasitaireController', () => {
  let controller: AntiParasitaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiParasitaireController],
    }).compile();

    controller = module.get<AntiParasitaireController>(AntiParasitaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

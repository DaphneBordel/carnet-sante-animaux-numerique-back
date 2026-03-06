import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentController } from './medicament.controller';

describe('MedicamentController', () => {
  let controller: MedicamentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicamentController],
    }).compile();

    controller = module.get<MedicamentController>(MedicamentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

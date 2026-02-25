import { Test, TestingModule } from '@nestjs/testing';
import { PoidsAnimalController } from './poids-animal.controller';

describe('PoidsAnimalController', () => {
  let controller: PoidsAnimalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoidsAnimalController],
    }).compile();

    controller = module.get<PoidsAnimalController>(PoidsAnimalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

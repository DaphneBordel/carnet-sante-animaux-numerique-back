import { Test, TestingModule } from '@nestjs/testing';
import { VaccinController } from './vaccin.controller';

describe('VaccinController', () => {
  let controller: VaccinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinController],
    }).compile();

    controller = module.get<VaccinController>(VaccinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

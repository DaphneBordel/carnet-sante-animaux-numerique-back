import { Test, TestingModule } from '@nestjs/testing';
import { VermifugeController } from './vermifuge.controller';

describe('VermifugeController', () => {
  let controller: VermifugeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VermifugeController],
    }).compile();

    controller = module.get<VermifugeController>(VermifugeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VermifugeService } from './vermifuge.service';

describe('VermifugeService', () => {
  let service: VermifugeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VermifugeService],
    }).compile();

    service = module.get<VermifugeService>(VermifugeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

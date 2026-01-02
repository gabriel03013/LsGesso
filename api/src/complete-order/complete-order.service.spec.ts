import { Test, TestingModule } from '@nestjs/testing';
import { CompleteOrderService } from './complete-order.service';

describe('CompleteOrderService', () => {
  let service: CompleteOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompleteOrderService],
    }).compile();

    service = module.get<CompleteOrderService>(CompleteOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

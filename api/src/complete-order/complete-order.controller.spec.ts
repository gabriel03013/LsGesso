import { Test, TestingModule } from '@nestjs/testing';
import { CompleteOrderController } from './complete-order.controller';
import { CompleteOrderService } from './complete-order.service';

describe('CompleteOrderController', () => {
  let controller: CompleteOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompleteOrderController],
      providers: [CompleteOrderService],
    }).compile();

    controller = module.get<CompleteOrderController>(CompleteOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

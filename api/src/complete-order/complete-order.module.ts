import { Module } from '@nestjs/common';
import { CompleteOrderService } from './complete-order.service';
import { CompleteOrderController } from './complete-order.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [CompleteOrderController],
  providers: [CompleteOrderService, PrismaService],
})
export class CompleteOrderModule {}

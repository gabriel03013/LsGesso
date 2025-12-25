import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CompleteOrderModule } from './complete-order/complete-order.module';
import { OrderModule } from './order/order.module';
import { OrderProductModule } from './order-product/order-product.module';


@Module({
  imports: [ProductModule, CompleteOrderModule, OrderModule, OrderProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

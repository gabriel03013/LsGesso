import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CompleteOrderModule } from './complete-order/complete-order.module';


@Module({
  imports: [ProductModule, CompleteOrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

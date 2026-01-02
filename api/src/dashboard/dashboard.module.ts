import { Module } from '@nestjs/common';
import { DashboardOrdersService } from './dashboard-orders.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { DashboardFinancialService } from './dashboard-financial.service';
import { DashboardService } from './dashboard.service';

@Module({
  imports : [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardOrdersService, DashboardFinancialService, DashboardService],
})
export class DashboardModule {}

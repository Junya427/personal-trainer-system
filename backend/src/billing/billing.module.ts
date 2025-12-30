// billing/billing.module.ts
import { Module } from '@nestjs/common'
import { Billing } from './domain/billing'
import { BillingController } from './controller/billing.controller'
import { BillingService } from './service/billing.service'
import { BillingNotificationService } from './service/billing-notification.service'
import { BillingRepository } from './repository/billing.repository'
import { NotificationModule } from '../notification/notification.module'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [
        NotificationModule,
        PrismaModule
    ],
    controllers: [BillingController],
    providers: [
        BillingService,
        BillingNotificationService,
        BillingRepository
    ],
})
export class BillingModule {}
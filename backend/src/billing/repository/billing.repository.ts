// billing/repository/billing.repository.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Billing } from '../domain/billing'
import { Prisma } from '@prisma/client'

@Injectable()
export class BillingRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(billing: Billing): Promise<void> {
        await this.prisma.billing.create({
            data: {
                customerId: billing.getTargetUserId(),
                billingTargetId: billing.getTargetUserId(),// TODO: 設計書に合わせて修正予定
                amount: new Prisma.Decimal(billing.getAmount()),
                dueDate: billing.getDueDate(),
                status: billing.getStatus(),
                confirmedAt: billing.getConfirmedAt(),
            }
        })
    }
}
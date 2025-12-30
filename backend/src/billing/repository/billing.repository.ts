// billing/repository/billing.repository.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Billing } from '../domain/billing'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class BillingRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(billing: Billing): Promise<void> {
        await this.prisma.billing.create({
            data: {
                customerId: billing['targetUserId'],
                billingTargetId: billing['targetUserId'],// TODO: 設計書に合わせて修正予定
                amount: new Decimal(billing['amount']),
                dueDate: billing['dueDate'],
                status: billing['status'],
                confirmedAt: billing.getConfirmedAt(),
            }
        })
    }
}
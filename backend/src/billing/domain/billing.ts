// billing/domain/billing.ts
import { BillingStatus } from './billing-status'

export class Billing {
    private confirmedAt: Date | null = null

    constructor(
        private readonly amount: number,
        private readonly dueDate: Date,
        private readonly targetUserId: string,
        private status: BillingStatus = 'DRAFT',
    ) {}

    confirm(now: Date): void {
        if (this.amount <= 0) {
            throw new Error('金額が0以下です')
        }

        if (this.dueDate <= now) {
            throw new Error('支払い期限は未来の日付にしてください')
        }

        if (this.status !== 'DRAFT') {
            throw new Error('既に確定済みです')
        }

        this.status = 'CONFIRMED'
        this.confirmedAt = now
    }

    // Serviceが参照するためのgetter
    getConfirmedAt(): Date | null {
        return this.confirmedAt
    }

}
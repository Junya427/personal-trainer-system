// billing/domain/billing.ts
import { BillingStatus } from './billing-status'

export class Billing {
    private confirmedAt: Date | null = null

    constructor(
        private readonly amount: number,
        private readonly dueDate: Date,
        private readonly targetUserId: string,
        private status: BillingStatus = 'DRAFT',
    ) {
        this.amount = Math.floor(this.amount)

        if (this.amount <= 0) {
            throw new Error('金額が0以下です')
        }

        if (!Number.isInteger(this.amount)) {
            throw new Error('金額の切り上げ処理が失敗しました')
        }
    }

    //　請求確定処理
    confirm(now: Date): void {

        // TODO: 他のドメインで支払期限の生成を行う際に、現実的な期限のルールを実装する
        // 今の実装は0.1秒でも未来なら請求が成立してしまう
        if (this.dueDate <= now) {
            throw new Error('支払い期限は未来の日付にしてください')
        }

        if (this.status !== 'DRAFT') {
            throw new Error('既に確定済みです')
        }

        this.status = 'CONFIRMED'
        this.confirmedAt = now
    }

    // Repositoryで使用するためのgetter
    getTargetUserId(): string {
        return this.targetUserId
    }

    getAmount(): number {
        return this.amount
    }

    getDueDate(): Date {
        return this.dueDate
    }

    getStatus(): BillingStatus {
        return this.status
    }

    // Serviceが参照するためのgetter
    getConfirmedAt(): Date | null {
        return this.confirmedAt
    }

}
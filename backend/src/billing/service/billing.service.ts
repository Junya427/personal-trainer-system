// billing/service/billing.service.ts
import { Injectable } from '@nestjs/common'
import { CreateBillingDto } from '../dto/create-billing.dto'
import { BillingRepository } from '../repository/billing.repository'
import { Billing } from '../domain/billing'

@Injectable()
export class BillingService {
    constructor(
        private readonly billingRepository: BillingRepository,
    ) {}

    async confirm(dto: CreateBillingDto) {
        const dueDate = new Date(dto.dueDate)

        // [TODO] 対象ユーザーを確認する
        // const user = await this.userRepository.findById(dto.targetUserId)
        // if (!user) {
        //     throw new Error('対象ユーザーが存在しません')
        // }

        // ドメインを生成
        const billing = new Billing(
            dto.amount,
            dueDate,
            dto.targetUserId,
        )

        // 業務ルールに従って確定
        billing.confirm(new Date())

        // 永続化
        await this.billingRepository.save(billing)

        // 通知（次のステップで実装）
    }
}
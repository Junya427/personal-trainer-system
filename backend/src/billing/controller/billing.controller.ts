// billing/controller/billing.controller.ts
import { Controller, Post, Body } from'@nestjs/common'
import { BillingService } from '../service/billing.service'
import { CreateBillingDto } from '../dto/create-billing.dto'

@Controller('billing')
export class BillingController {
    constructor(
        private readonly billingService: BillingService,
    ) {}

    @Post('confirm')
    async confirmBilling(
        @Body() dto: CreateBillingDto
    ) {
        await this.billingService.confirm(dto)

        return {
            success: true,
        }
    }
}
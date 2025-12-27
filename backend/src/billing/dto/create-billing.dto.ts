// billing/dto/create-billing.dto.ts
import { IsNumber, IsString, IsDateString } from 'class-validator'

export class CreateBillingDto {
    @IsNumber()
    amount: number

    @IsDateString()
    dueDate: string
    
    @IsString()
    targetUserId: string
}
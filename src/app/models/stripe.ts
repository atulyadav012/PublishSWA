export interface StripeConnectDTO {
    UserMasterId: number,
    BusinessType:string
}
//Following 2 interface added by atul on 25 apr 22 by atul
export interface IsStripeConnectedDTO {
    UserMasterId: Number,
    ProfileType:string
}

export interface StripePaymentSetupDTO {
    UserMasterId: number,
    PaymentMethodId:number
}

export interface SavePaymentDetailDTO {
    CheckoutSessionId: string
}
export interface GetPaymentDetailDTO {
    InvoiceId: string
}

export interface UserIdDTO {
    UserMasterId: Number
}

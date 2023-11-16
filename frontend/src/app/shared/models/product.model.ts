import { Condition } from "@app/shared/models/condition.model"



export type Product = {
    id: number,
    name: string,
    price: number,
    hasReceipt: boolean,
    warranty: string,
    categoryId: number,
    categoryName: string,
    condition: Condition,
    imageUrls: string[]
    NoticeId: number,
    NoticeCity: string,
    NoticePayment: string,
    NoticeDeliveryMethod: string,
}
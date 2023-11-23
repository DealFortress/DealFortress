import { Condition } from "@app/shared/models/condition.model"
import { Image } from "@app/shared/models/image.model"



export type Product = {
    id: number,
    name: string,
    price: number,
    hasReceipt: boolean,
    warranty: string,
    categoryId: number,
    categoryName: string,
    condition: Condition,
    images: Image[],
    NoticeId: number,
    NoticeCity: string,
    NoticePayment: string,
    NoticeDeliveryMethod: string,
}
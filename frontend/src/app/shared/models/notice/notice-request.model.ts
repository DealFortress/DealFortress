import { ProductRequest } from "../product/product-request.model"

export type NoticeRequest = {
    userId: number,
    title: string,
    description: string,
    city: string,
    payments: string[],
    deliveryMethods: string[],
    createdAt?: Date,
    productRequests: ProductRequest[]
}
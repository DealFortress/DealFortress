import { Product } from "@app/shared/models/product.model"

export type Notice = {
    id: number,
    userId: number,
    title: string,
    description: string,
    city: string,
    payments: string,
    products: Product[],
    deliveryMethods: string,
    createdAt: Date
}

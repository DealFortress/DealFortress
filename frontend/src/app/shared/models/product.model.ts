import { Condition } from "@app/shared/models/condition.model"
import { Image } from "@app/shared/models/image.model"



export type Product = {
    id: number,
    name: string,
    price: number,
    hasReceipt: boolean,
    warranty: string,
    isSold: boolean,
    isSoldSeparately: boolean,
    categoryId: number,
    condition: Condition,
    images: Image[],
}
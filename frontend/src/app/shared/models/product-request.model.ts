import { Condition } from "@app/shared/models/condition.model"
import { ImageRequest } from "./image-request.model"



export type ProductRequest = {
    name: string,
    price: number,
    hasReceipt: boolean,
    isSold: boolean,
    isSoldSeparately: boolean,
    warranty: string,
    categoryId: number,
    condition: Condition,
    imageRequests: ImageRequest[],
}
import { Condition } from "@app/shared/models/condition.model"
import { ImageRequest } from "../image/image-request.model"
import { SoldStatus } from "../sold-status.model"



export type ProductRequest = {
    name: string,
    price: number,
    hasReceipt: boolean,
    soldStatus: SoldStatus,
    isSoldSeparately: boolean,
    warranty: string,
    categoryId: number,
    condition: Condition,
    imageRequests: ImageRequest[],
}
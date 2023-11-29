import { Condition } from "@app/shared/models/condition.model"
import { Image } from "@app/shared/models/image.model"
import { SoldStatus } from "./sold-status.model"

export type Product = {
    id: number,
    noticeId: number,
    name: string,
    price: number,
    hasReceipt: boolean,
    warranty: string,
    soldStatus: SoldStatus,
    isSoldSeparately: boolean,
    categoryId: number,
    condition: Condition,
    images: Image[],
}
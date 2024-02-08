import { Message } from "../message/message.model"

export type Conversation = {
    id: number,
    noticeId: number,
    name: string,
    buyerId: number,
    sellerId: number,
    buyerLastReadMessageId: number,
    sellerLastReadMessageId: number,
    messages: Message[]
}
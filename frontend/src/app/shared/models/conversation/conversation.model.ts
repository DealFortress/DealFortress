import { Message } from "../message/message"

export type Conversation = {
    id: number,
    noticeId: number,
    name: string,
    BuyerId: number,
    SellerId: number,
    messages: Message[]
}
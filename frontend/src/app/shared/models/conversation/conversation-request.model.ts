import { Message } from "../message/message"

export type Conversation = {
    noticeId: number,
    name: string,
    BuyerId: number,
    SellerId: number,
    messages: Message[]
}
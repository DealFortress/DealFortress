import { Message } from "../message/message"

export type Conversation = {
    id: number,
    noticeId: number,
    name: string,
    buyerId: number,
    sellerId: number,
    messages: Message[]
}
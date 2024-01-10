import { MessageRequest } from "../message/message-request"

export type ConversationRequest = {
    noticeId: number,
    name: string,
    BuyerId: number,
    SellerId: number,
    messageRequests: MessageRequest[]
}
import { MessageRequest } from "../message/message-request"

export type ConversationRequest = {
    noticeId: number,
    name: string,
    buyerId: number,
    sellerId: number,
    messageRequests: MessageRequest[]
}
import { MessageRequest } from "../message/message-request.model"

export type ConversationRequest = {
    noticeId: number,
    name: string,
    buyerId: number,
    sellerId: number,
    messageRequests: MessageRequest[]
}
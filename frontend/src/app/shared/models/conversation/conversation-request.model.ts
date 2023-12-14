import { Message } from "../message/message"

export type Conversation = {
    noticeId: number,
    name: string,
    userOneId: number,
    userTwoId: number,
    messages: Message[]
}
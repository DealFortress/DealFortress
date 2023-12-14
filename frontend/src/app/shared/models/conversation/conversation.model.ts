import { Message } from "../message/message"

export type Conversation = {
    id: number,
    noticeId: number,
    name: string,
    userOneId: number,
    userTwoId: number,
    messages: Message[]
}
import { Message } from "../message/message"

export type Conversation = {
    NoticeId: number,
    Name: string,
    UserOneId: number,
    UserTwoId: number,
    Messages: Message[]
}
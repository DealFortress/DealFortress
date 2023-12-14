import { Message } from "../message/message"

export type Conversation = {
    Id: number,
    NoticeId: number,
    Name: string,
    UserOneId: number,
    UserTwoId: number,
    Messages: Message[]
}
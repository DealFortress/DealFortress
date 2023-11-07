export type NoticeRequest = {
    userId: number,
    title: string,
    description: string,
    city: string,
    payments: string[],
    deliveryMethods: string[],
}
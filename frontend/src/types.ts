
export type Notice = {
    id: number,
    title: string,
    description: string,
    city: string,
    payment: string,
    products: Product[],
    deliveryMethod: string,
    createdAt: Date
}

export type NoticeRequest = {
    title: string,
    description: string,
    city: string,
    payments: string[],
    deliveryMethods: string[],
}

export type NoticesContextType = {
    notices: Notice[],
    GetNotices: () => void,
    PostNotice: (request: NoticeRequest) => Notice
}

export type Product = {
    id: number,
    name: string,
    price: number,
    receipt: boolean,
    warranty: string,
    categoryId: number,
    categoryName: string,
    condition: Condition,
    images: Image[]
    NoticeId: number,
    NoticeCity: string,
    NoticePayment: string,
    NoticeDeliveryMethod: string,
}

export type Category = {
    id: number,
    name: string
}

export type Image = {
    id: number,
    url: string,
    description: string
}

enum Condition {
    New,
    LikeNew,
    Used,
    Modified,
    Defective,
    Broken
}


export type ProductFilterType = {
    categoryFilter: string,
    cityFilter: string,
    // deliveryMethodFilter: string,
    // conditionFilter: string
}

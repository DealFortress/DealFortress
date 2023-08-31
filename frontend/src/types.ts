import { UseQueryResult } from "@tanstack/react-query"

export type Notice = {
    id: number,
    title: string,
    description: string,
    city: string,
    payments: string,
    products: Product[],
    deliveryMethods: string,
    createdAt: Date
}

export type NoticeRequest = {
    title: string,
    description: string,
    city: string,
    payments: string[],
    deliveryMethods: string[],
}

export type MarketContextType = {
    noticesQuery: UseQueryResult,
    categoriesQuery: UseQueryResult
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
}

export type PutRequestType<T> = {
  id: number,
  request: T,
  accessToken: string
}

export type PostRequestType<T> = {
  request: T,
  accessToken: string
}


export type SellAd = {
    id: number,
    title: string,
    description: string,
    city: string,
    payment: string,
    products: Product[],
    deliveryMethod: string,
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
    sellAdId: number,
    sellAdCity: string,
    sellAdPayment: string,
    sellAdDeliveryMethod: string,
} 

export type Category = {
    id: number,
    name: string
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
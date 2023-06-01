
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
    Condition: Condition,
    SellAdId: number
}      

enum Condition {
    New,
    LikeNew,
    Used,
    Modified,
    Defective,
    Broken
}
       
        
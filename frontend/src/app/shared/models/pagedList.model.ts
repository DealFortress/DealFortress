export type PagedList<T> = {
    metaData : Metadata,
    items : T[]
}

export type Metadata = {
    pageIndex: number,
    pageSize: number,
    totalCount : number,
    totalPages : number,  
    hasPreviousPage : boolean,
    hasNextPage : boolean
}
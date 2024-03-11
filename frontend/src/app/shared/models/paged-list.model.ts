export type PagedList<T> = {
    metaData : Metadata,
    entities : T[]
}

export type Metadata = {
    pageIndex: number,
    pageSize: number,
    totalCount : number,
    totalPages : number,  
    hasPreviousPage : boolean,
    hasNextPage : boolean
}
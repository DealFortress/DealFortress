export type PagedList<T> = {
    pageIndex: number,
    pageSize: number,
    TotalCount : number,
    TotalPages : number,  
    HasPreviousPage : boolean,
    HasNextPage : boolean
    Entities : T[]
}
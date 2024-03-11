import { Notice } from "./notice/notice.model"

// export type searchResult = {
//     sortDirection: string,
//     sortField: string,
//     sortList: string[],
//     autocompletedResults:[],
//     autocompletedResultsRequestId:string,
//     autocompletedSuggestions:{},
//     autocompletedSuggestionsRequestId:string,
//     current: number,
//     error: string,
//     facets: {},
//     filters: string[],
//     isLoading: false,
//     pagingEnd: number,
//     pagingStart:number
//     rawResponse: {},
//     requestId: string,
//     resultSearchTerm: string,
//     results: Notice[],
//     resultsPerPage: number,
//     searchTerm: string,
//     totalPages: number,
//     totalResults: number,
//     wasSearched: boolean,
// }

export type noticeSearchResult = {
    city: {raw: string},
    deliveryMethods: {raw: string[]},
    description: {raw: string},
    id:{ raw: number},
    payments: {raw: string[]},
    title: {raw: string},
    userId: {raw: number},
    _meta: { engine: string, id: string, score: number, }
    condition: {raw: number[]},
    createdAt: {raw: Date},
    "products.id": {raw: number[]},
    "products.categoryId": {raw: number[]},
    "products.condition": {raw: number[]},
    "products.images.url": {raw: string[]},
    "products.name": {raw: string[]},
    "products.noticeId": {raw: number[]},
    "products.price": {raw: number[]},
    "products.soldStatus": {raw: number[]},
    "products.warranty": {raw: string[]},
    "products.hasReceipt": {raw: boolean[]},
    "products.isSoldSeparately": {raw: boolean[]},
}

// type productSearchResult = {
//     id: {raw: number[]},
//     images : imageSearchResult[],
//     name: {raw: string[]},
//     noticeId: {raw: number[]},
//     price: {raw: number[]},
//     soldStatus: {raw: number[]},
//     warranty: {raw: string[]},
// }

// type imageSearchResult = {
//     url: string
// }
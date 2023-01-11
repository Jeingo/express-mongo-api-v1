export type PaginatedType<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

export type QueryBlogs = {
    searchNameTerm?: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}

export type QueryPosts = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}

export type QueryUsers = {
    searchLoginTerm?: string
    searchEmailTerm?: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}

export type QueryComments = {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: string
    pageSize: string
}
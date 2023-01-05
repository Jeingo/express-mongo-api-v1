export type BlogsTypeOutput = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type BlogsTypeInput = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogsTypeToDB = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type BlogsIdParams = {
    id: string
}
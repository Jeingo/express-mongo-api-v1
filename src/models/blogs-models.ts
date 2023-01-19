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

export class BlogsTypeToDB {
    constructor(public name: string, public description: string, public websiteUrl: string, public createdAt: string) {}
}

export type BlogsIdParams = {
    id: string
}

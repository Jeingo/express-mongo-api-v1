import {PostsTypeOutput} from "../models/posts-models"
import {blogsCollection, postsCollection} from "../repositories/db"
import {ObjectId} from "mongodb"
import {QueryPosts} from "../models/query-models";
import {PaginatedType} from "../models/main-models";
import {getPaginatedType, makeDirectionToNumber} from "./helper";

const getOutputPost = (post: any): PostsTypeOutput => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsQueryRepository = {
    async getAllPost(query: QueryPosts): Promise<PaginatedType<PostsTypeOutput>> {
        const countAllDocuments = await postsCollection.countDocuments()
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await postsCollection
            .find()
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        return getPaginatedType(res.map(getOutputPost), +pageSize, +pageNumber, countAllDocuments)
    },
    async getPostsById(id: string, query: QueryPosts): Promise<PaginatedType<PostsTypeOutput> | null> {
        const foundBlogs = await blogsCollection.findOne({_id: new ObjectId(id)})
        if(!foundBlogs) {
            return null
        }
        const countAllDocuments = await postsCollection.countDocuments({blogId: id})
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await postsCollection
            .find({blogId: id})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()

        return getPaginatedType(res.map(getOutputPost), +pageSize, +pageNumber, countAllDocuments)
    }
}
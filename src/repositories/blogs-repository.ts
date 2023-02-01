import { ObjectId } from 'mongodb'
import { injectable } from 'inversify'
import {BlogsModel} from "../domain/blogs-entity";

@injectable()
export class BlogsRepository {
    async getBlogById(id: string) {
        return BlogsModel.findById(new ObjectId(id))
    }
    async saveBlog(blog: any) {
        return await blog.save()
    }
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogsModel.findByIdAndDelete(new ObjectId(id))
        return !!result
    }
}

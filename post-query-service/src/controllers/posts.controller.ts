import { NextFunction, Request, Response } from 'express';
import { PostUserIds } from '../common/dtos/postUserIds.dto';
import { Post } from '../entities/posts.entity';
import postService from '../services/posts.service';

class PostsController {
  public postService = new postService();

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.postService.findPostById(req.params.id);
      res.json({ ...post });
    } catch (err) {
      next(err);
    }
  };

  public getPostsByUserIds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postUserIds: PostUserIds = req.body;
      const ids = postUserIds.ids;
      const posts: Post[] = await this.postService.findPostsByUserIds(ids);
      res.json(posts);
    } catch (err) {
      next(err);
    }
  };
}

export default PostsController;

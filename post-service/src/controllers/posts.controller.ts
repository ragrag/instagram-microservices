import { NextFunction, Request, Response } from 'express';
import { CreatePostDTO } from '../common/dtos';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import { Post } from '../entities/posts.entity';
import postService from '../services/posts.service';

class PostsController {
  public postService = new postService();

  public createPost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { photo, caption }: CreatePostDTO = req.body;

      const createPostDTO: CreatePostDTO = { photo, caption: caption ?? '' };
      const post = await this.postService.createPost(req.user, createPostDTO);

      res.status(200).json({ ...post });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;

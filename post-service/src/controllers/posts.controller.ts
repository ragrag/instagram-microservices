import { NextFunction, Request, Response } from 'express';
import { UpdateUserDTO, UpdateUserPasswordDTO } from '../common/dtos';
import { Post } from '../entities/posts.entity';
import postService from '../services/posts.service';

class PostsController {
  public postService = new postService();

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ user: req.user });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;

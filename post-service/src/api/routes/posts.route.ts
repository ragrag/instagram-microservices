import { Router } from 'express';
import PostsController from '../../controllers/posts.controller';
import { CreatePostDTO } from '../../common/dtos';
import Route from '../../common/interfaces/routes.interface';
import authenticationMiddleware from '../middlewares/authenticate.middleware';

class PostsRroute implements Route {
  public path = '/posts';
  public router = Router();
  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, [authenticationMiddleware], this.postsController.createPost);
  }
}

export default PostsRroute;

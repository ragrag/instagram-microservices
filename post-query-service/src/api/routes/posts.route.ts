import { Router } from 'express';
import Route from '../../common/interfaces/routes.interface';
import PostsController from '../../controllers/posts.controller';

class PostsRroute implements Route {
  public path = '/posts';
  public router = Router();
  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}`, [authenticationMiddleware, validationMiddleware(CreatePostDTO, 'body', true)], this.postsController.createPost);
    this.router.get(`${this.path}/:id`, this.postsController.getPostById);
    this.router.post(`${this.path}/users`, this.postsController.getPostsByUserIds);
    // this.router.get(`${this.path}/:id`, this.postsController.getById);
  }
}

export default PostsRroute;

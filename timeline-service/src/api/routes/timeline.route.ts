import { Router } from 'express';
import TimelineController from '../../controllers/timeline.controller';
import { CreatePostDTO } from '../../common/dtos';
import Route from '../../common/interfaces/routes.interface';
import authenticationMiddleware from '../middlewares/authenticate.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

class TimelineRoutes implements Route {
  public path = '/timeline';
  public router = Router();
  public timelineController = new TimelineController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id`,

      this.timelineController.getTimeline,
    );
  }
}

export default TimelineRoutes;

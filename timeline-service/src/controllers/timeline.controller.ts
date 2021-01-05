import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import timelineService from '../services/posts.service';

class TimelineController {
  public timelineService = new timelineService();

  public getTimeline = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const timelinePosts = await this.timelineService.getTimeline(Number(req.params.id));
      res.status(200).json(timelinePosts);
    } catch (error) {
      next(error);
    }
  };
}

export default TimelineController;

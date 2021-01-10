import { NextFunction, Request, Response } from 'express';
import * as Boom from '@hapi/boom';
import { logger } from '../../common/utils/logger';
import axios from 'axios';

async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authUserResponse = await axios.get('http://users-service:3005/api/v1/user', {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    req.user = authUserResponse.data;
    next();
  } catch (err) {
    logger.error(err);
    res.status(Boom.unauthorized().output.statusCode).send();
  }
}
export default authenticationMiddleware;

import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import { CreateUserDTO, LoginUserDTO } from '../common/dtos';

import { User } from '../entities/users.entity';
import AuthService from '../services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createUserDTO: CreateUserDTO = req.body;
      const signedUpUser: User = await this.authService.signup(createUserDTO);
      const { token } = await this.authService.createToken(signedUpUser);

      const userResponse = _.omit(signedUpUser, ['password']);
      res.cookie('Authorization', token, {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: true,
      });

      res.status(201).json({ ...userResponse, token });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginUserDTO: LoginUserDTO = req.body;
      const { token, findUser } = await this.authService.login(loginUserDTO);

      res.cookie('Authorization', token, {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: true,
      });
      const userResponse = _.omit(findUser, ['password']);

      res.status(200).json({ ...userResponse, token });
    } catch (error) {
      next(error);
    }
  };

  public authenticateSocial = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = await this.authService.createToken(req.user as User);

      res.cookie('Authorization', token, {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: true,
      });
      const userResponse = _.pick(req.user, ['email', 'displayName', 'id']);
      return res.status(200).json({ token: token, ...userResponse });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('Authorization');
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;

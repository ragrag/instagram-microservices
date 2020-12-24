import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Boom from '@hapi/boom';
import { CreateUserDTO, LoginUserDTO } from '../common/dtos';
import { DataStoredInToken, TokenData } from '../common/interfaces/auth.interface';
import { User } from '../entities/users.entity';
import { isEmpty } from '../common/utils/util';
import { eventEmitter, Events } from '../common/utils/eventEmitter';

class AuthService {
  public async signup(createUserDTO: CreateUserDTO): Promise<User> {
    if (isEmpty(createUserDTO)) throw Boom.badRequest();

    const findUser: User = await User.findOne({
      where: [
        { email: createUserDTO.email },
        {
          username: createUserDTO.username,
        },
      ],
    });

    if (findUser) {
      if (findUser.email === createUserDTO.email) throw Boom.conflict(`Email ${createUserDTO.email} already exists`);
      if (findUser.username === createUserDTO.username) throw Boom.conflict(`Username ${createUserDTO.username} already exists`);
    }
    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
    const createdUserData: User = await User.save({ ...createUserDTO, password: hashedPassword } as User);
    eventEmitter.emit(Events.USER_CREATED, { email: createUserDTO.email });
    return createdUserData;
  }

  public async login(loginUserDTO: LoginUserDTO): Promise<{ token: string; findUser: User }> {
    console.log(loginUserDTO);
    const findUser: User = await User.findOne({
      where: [
        { email: loginUserDTO.email },
        {
          username: loginUserDTO.username,
        },
      ],
    });
    if (!findUser) throw Boom.notFound();

    const isPasswordMatching: boolean = await bcrypt.compare(loginUserDTO.password, findUser.password);
    if (!isPasswordMatching) throw Boom.unauthorized();

    const { token } = this.createToken(findUser);

    return { token, findUser };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }
}

export default AuthService;

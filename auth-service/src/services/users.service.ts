import bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from '../common/dtos';
import * as Boom from '@hapi/boom';

import { User } from '../entities/users.entity';
import { isEmpty } from '../common/utils/util';

class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await User.find();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await User.findOne(userId);
    if (!findUser) throw Boom.conflict();

    return findUser;
  }

  public async createUser(userData: CreateUserDTO): Promise<User> {
    if (isEmpty(userData)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw Boom.conflict(`You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await User.save({ ...userData, password: hashedPassword } as User);

    return createUserData;
  }

  public async updateUser(userId: number, updateUserDTO: UpdateUserDTO): Promise<void> {
    if (isEmpty(updateUserDTO)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    await User.update(userId, { ...updateUserDTO });
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    await User.delete({ id: userId });
    return findUser;
  }
}

export default UserService;

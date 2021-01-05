import bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from '../common/dtos';
import * as Boom from '@hapi/boom';
import { eventEmitter } from '../common/utils/eventEmitter';
import { User } from '../entities/users.entity';
import { isEmpty } from '../common/utils/util';
import MessageBrokerService from './messageBroker.service';
import { getManager } from 'typeorm';

class UserService {
  private Events = {
    USER_CREATED: 'UserCreated',
  };

  constructor() {
    eventEmitter.on(this.Events.USER_CREATED, ({ email }) => {
      MessageBrokerService.getInstance().sendEvent({ topic: this.Events.USER_CREATED, value: JSON.stringify({ email }) });
    });
  }

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await User.find();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await User.findOne(userId);
    if (!findUser) throw Boom.notFound();

    return findUser;
  }

  public async createUser(userData: CreateUserDTO): Promise<User> {
    if (isEmpty(userData)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw Boom.conflict(`You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser: User = await User.save({ ...userData, password: hashedPassword } as User);
    eventEmitter.emit(this.Events.USER_CREATED, createdUser.email);
    return createdUser;
  }

  public async followUser(user: User, userId: number): Promise<void> {
    const findUser: User = await User.findOne(userId, { relations: ['following', 'followers'] });
    if (!findUser) throw Boom.notFound("user doesn't exist");
    if (user.following.findIndex(e => e.id === findUser.id) !== -1) throw Boom.conflict('Already following');
    user.following.push(findUser);
    findUser.followers.push(user);
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(user);
      await transactionalEntityManager.save(findUser);
      // ...
    });
  }

  public async getFollowingIds(userId: number): Promise<number[]> {
    const findUser: User = await User.findOne(userId, { relations: ['following', 'followers'] });
    if (!findUser) throw Boom.notFound("user doesn't exist");

    const followingIds = findUser.following.map(e => e.id);
    console.log(followingIds);
    return followingIds;
  }
  public async updateUser(userId: number, updateUserDTO: UpdateUserDTO): Promise<void> {
    if (isEmpty(updateUserDTO)) throw Boom.badRequest();

    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    await User.update(userId, { ...updateUserDTO });
  }

  public async updateUserPassword(userId: number, updateUserPasswordDTO: UpdateUserPasswordDTO): Promise<void> {
    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    const isPasswordMatching: boolean = await bcrypt.compare(updateUserPasswordDTO.oldPassword, findUser.password);
    if (!isPasswordMatching) throw Boom.unauthorized('Incorrect old password');
    const hashedPassword = await bcrypt.hash(updateUserPasswordDTO.newPassword, 10);
    await User.update(userId, { password: hashedPassword });
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await User.findOne({ where: { id: userId } });
    if (!findUser) throw Boom.notFound();

    await User.delete({ id: userId });
    return findUser;
  }
}

export default UserService;

import bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from '../common/dtos';
import * as Boom from '@hapi/boom';
import { eventEmitter } from '../common/utils/eventEmitter';
import { Post } from '../entities/posts.entity';
import { isEmpty } from '../common/utils/util';
import MessageBrokerService from './messageBroker.service';

class PostsService {
  private Events = {
    USER_CREATED: 'PostCreated',
  };

  constructor() {
    // eventEmitter.on(this.Events.USER_CREATED, ({ email }) => {
    //   MessageBrokerService.getInstance().sendEvent({ topic: this.Events.USER_CREATED, value: JSON.stringify({ email }) });
    // });
  }

  public async findPostById(postId: number): Promise<Post> {
    const findUser: Post = await Post.findOne(postId);
    if (!findUser) throw Boom.conflict();

    return findUser;
  }
}

export default PostsService;

import * as Boom from '@hapi/boom';
import { Container } from 'typedi';
import { v4 as uuid } from 'uuid';
import { CreatePostDTO } from '../common/dtos';
import { eventEmitter } from '../common/utils/eventEmitter';
import { Post } from '../entities/posts.entity';
import { isEmpty } from '../common/utils/util';
import MessageBrokerService from './messageBroker.service';
import GCSService from './gcs.service';
import { User } from '../common/interfaces/user.interface';

class PostsService {
  private Events = {
    POST_CREATED: 'PostCreated',
  };

  constructor() {
    eventEmitter.on(this.Events.POST_CREATED, post => {
      MessageBrokerService.getInstance().sendEvent({ topic: this.Events.POST_CREATED, value: JSON.stringify({ ...post }, null, 2) });
    });
  }

  public async createPost(user: User, createPostDTO: CreatePostDTO): Promise<Post> {
    //
    const GCSServiceInstance = Container.get(GCSService);
    const postPhotoUrl = await GCSServiceInstance.uploadBase64(createPostDTO.photo, `${user.id}/posts/${uuid()}`);
    const createdPost: Post = await Post.save({ caption: createPostDTO.caption, photo: postPhotoUrl, userId: user.id } as Post);
    eventEmitter.emit(this.Events.POST_CREATED, { post: createdPost, user: user });
    return createdPost;
  }
}

export default PostsService;

import { CreatePostDTO } from '../common/interfaces/createPostDTO.interface';
import { Event } from '../common/interfaces/Event.interface';
import { logger } from '../common/utils/logger';
import { Post } from '../entities/posts.entity';
import EventHandler from './eventHandler.service';

class PostsService {
  private eventHandlers: Event[] = [
    {
      topic: 'PostCreated',
      cb: async post => {
        await this.createPost(post);
      },
    },
  ];

  constructor() {
    this.registerEvents();
  }

  public registerEvents() {
    EventHandler.registerEvents(this.eventHandlers);
  }

  public async createPost(postDTO: CreatePostDTO): Promise<void> {
    try {
      await Post.save({
        ...postDTO.post,
        userUsername: postDTO.user.username,
      } as Post);
    } catch (err) {
      logger.error(`Unable to created post ${postDTO}`);
      throw err;
    }
    return;
  }
}

export default PostsService;

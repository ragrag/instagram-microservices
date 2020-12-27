import { Post } from '../../entities/posts.entity';
import { User } from './user.interface';

export interface CreatePostDTO {
  post: Post;
  user: User;
}

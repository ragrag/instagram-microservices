import axios from 'axios';
import { Post } from '../common/interfaces/post.interface';

class TimelineService {
  public async getTimeline(userId: number): Promise<Post[]> {
    // return createdPost;

    let response = await axios.get(`http://localhost:3005/api/v1/user/${userId}/following`);
    const userFollowingIds = response.data;
    console.log(userFollowingIds);
    response = await axios.post(`http://localhost:3007/api/v1/posts/users`, {
      ids: [...userFollowingIds],
    });
    const timelinePosts: Post[] = response.data;
    return timelinePosts;
  }
}

export default TimelineService;

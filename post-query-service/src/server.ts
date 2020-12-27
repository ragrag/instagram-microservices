import 'dotenv/config';
import IndexRoute from './api/routes/index.route';
import PostsRoute from './api/routes/posts.route';
import App from './app';
import './common/utils/handleRunErrors';
import validateEnv from './common/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new PostsRoute()]);

app.listen();

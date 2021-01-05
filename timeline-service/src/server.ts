import 'dotenv/config';
import './common/utils/handleRunErrors';

import App from './app';

import IndexRoute from './api/routes/index.route';
import TimelineRoutes from './api/routes/timeline.route';

import validateEnv from './common/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new TimelineRoutes()]);

app.listen();

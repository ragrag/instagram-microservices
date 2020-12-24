import 'dotenv/config';
import './common/utils/handleRunErrors';

import App from './app';
import IndexRoute from './api/routes/index.route';

import validateEnv from './common/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute()]);

app.listen();

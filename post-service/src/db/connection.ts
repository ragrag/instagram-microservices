import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';
const dbConnection: ConnectionOptions = {
  url: env === 'production' ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL_DEV,
  type: 'mysql',
  synchronize: env === 'production' ? false : true,
  logging: false,
  entities: [env === 'production' ? 'build/entities/*{.ts,.js}' : 'src/entities/*{.ts,.js}'],
  migrations: [env === 'production' ? 'build/db/migrations/*{.ts,.js}' : 'src/db/migrations/*{.ts,.js}'],
  subscribers: [env === 'production' ? 'build/db/subscribers/*{.ts,.js}' : 'src/db/subscribers/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'src/subscribers',
  },
  migrationsRun: true,
  extra: {
    insecureAuth: true,
  },
  // host: 'http://mysql-service',
  // port: 3306,
  // username: 'root',
  // password: 'root',
  // database: 'instagram-post',
};

export = dbConnection;

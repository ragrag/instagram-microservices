import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';
const dbConnection: ConnectionOptions = {
  logging: false,
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'instagram-post-query',
  entities: [env === 'production' ? 'build/entities/*{.ts,.js}' : 'src/entities/*{.ts,.js}'],
  migrations: [env === 'production' ? 'build/db/migrations/*{.ts,.js}' : 'src/db/migrations/*{.ts,.js}'],
  subscribers: [env === 'production' ? 'build/db/subscribers/*{.ts,.js}' : 'src/db/subscribers/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'src/subscribers',
  },
};

export = dbConnection;

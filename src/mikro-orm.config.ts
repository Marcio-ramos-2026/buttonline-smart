import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';

const config: Options = {
  driver: PostgreSqlDriver,
  // folder-based discovery setup, using common filename suffix
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['src/lib/entity/**/*.ts'],
  migrations: {
    path: 'src/migrations',
    emit: 'ts',
    snapshot: false
  },
  extensions: [Migrator],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  host: 'ep-rough-morning-a4giuifp.us-east-1.aws.neon.tech',
  port: 5432,
  dbName:'verceldb',
  user: 'default',
  password: 'N3wXpgJS2tHl',
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false, // or true, depending on your security requirements
      },
    },
  },
};

export default config;
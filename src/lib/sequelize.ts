import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { Potato } from './entities/user';



const sequelize = new Sequelize({
  dialect: PostgresDialect,
  user: "default",
  password: "N3wXpgJS2tHl",
  host: "ep-rough-morning-a4giuifp.us-east-1.aws.neon.tech",
  port: 5432,
  database: "verceldb",
  ssl: true,
  models: [Potato]
});
import "reflect-metadata"
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "ep-rough-morning-a4giuifp.us-east-1.aws.neon.tech",
    port: 5432,
    username: "default",
    password: "N3wXpgJS2tHl",
    database: "verceldb",
    entities: [__dirname + '/entity/**/*.ts'],
    migrations: [__dirname + '/migration/**/*.ts'],
    synchronize: true,
    logging: false,
})

export default AppDataSource
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Potato } from "./entity/potato"

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

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))
const {Sequelize} = require('sequelize')
const {Umzug,SequelizeStorage} = require('umzug')

const dataSource = {
    dialect: 'postgres',
    user: "default",
    password: "N3wXpgJS2tHl",
    host: "ep-rough-morning-a4giuifp.us-east-1.aws.neon.tech",
    port: 5432,
    database: "verceldb",
    ssl: true
  }

const sequelize = new Sequelize(dataSource)

const umzug = new Umzug({
    migrations: {glob: 'migrations/*.js'},
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({sequelize}),
    logger: console,
  })
exports.umzug = umzug

if (require.main === module) {
  umzug.runAsCLI()
}
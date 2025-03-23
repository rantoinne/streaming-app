import 'dotenv/config'

export default {
  development: {
    use_env_variable: 'MYSQL_DB',
    dialect: 'mysql',
    // dialectOptions: {
    //   ssl: { require: true },
    // },
  },
  test: {},
  production: {
    use_env_variable: 'MYSQL_DB',
    dialect: 'mysql',
    logging: false,
  },
}

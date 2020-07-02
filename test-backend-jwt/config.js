if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ debug: process.env.DEBUG })
}

const requireProcessEnv = (name) => {
  if (process.env[name]) return process.env[name]
  throw new Error(`You must set the ${name} environment variable`)
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT,
  ip: process.env.IP,
  jwtSecret: requireProcessEnv('JWT_SECRET'),
  mongo: { uri: requireProcessEnv('MONGODB_URI'), options: { db: { safe: true } } },
  connection: './data',
}

if (config.env === 'development') config.mongo.options.debug = true

module.exports = config

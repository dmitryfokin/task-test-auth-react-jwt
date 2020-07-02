const mongoose = require('mongoose')

const open = () => new Promise((resolve) => mongoose.connection.on('open', resolve))
const drop = () => new Promise((resolve) => mongoose.connection.db.dropDatabase(resolve))
const requireModels = () => {
  require('../model/user')

  const promises = Object.keys(mongoose.models)
    .map(i => mongoose.models[i].ensureIndexes())

  return Promise.all(promises)
}

const createUsers = () => {
  const users = [
    { email: 'bob@test.com', password: 'superuser'},
    { email: 'orni@test.com', password: '123321'},
    { email: 'admin@test.com', password: 'thetruehero'}
  ]

  const promises = users.map((u) => {
    const user = new mongoose.models.User(u)
    return user.save()
  })

  return Promise.all(promises)
}

(async () => {
  try {
    await open()
    await drop()
    await requireModels()
    await createUsers()
    mongoose.disconnect()
  } catch (err) {
    mongoose.disconnect()
    process.exit(err ? 255 : 0)
  }
})()

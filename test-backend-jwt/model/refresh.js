const { Schema, model } = require('mongoose')

const schema = new Schema({
  userId: { type: String, required: true },
  refresh: { type: String, required: true },
})

module.exports = model('Refresh', schema)
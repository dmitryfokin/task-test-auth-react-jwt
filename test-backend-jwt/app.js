const express = require('express')
const cors = require('cors')
const compression = require('compression')
const jwtMiddleware = require('express-jwt')

const config = require('./config')

const app = express()

app.use(cors())
app.use(compression())
app.use(express.json({ extended: true }))
app.use('/auth', require('./routes/auth'))
app.use(jwtMiddleware({ secret: config.jwtSecret }))
app.use('/user', require('./routes/user'))


module.exports = app
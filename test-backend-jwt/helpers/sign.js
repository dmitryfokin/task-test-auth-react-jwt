const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = ({ exp, ...payload }) => jwt.sign(payload, config.jwtSecret, { expiresIn: exp || '30s' })

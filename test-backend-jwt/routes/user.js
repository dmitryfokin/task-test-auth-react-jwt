const router = require('express').Router()
const auth = require('../middleware/auth')
const User = require('../model/user')

const hError = require('../helpers/error')

router.get('/list', auth, async (req, res) => {
  const list = await User.find({})
  res.json(list)
})

router.get('/item/:id', async (req, res) => {
  try {
    res.json(await User.findOne({ _id: req.params.id }))
  } catch {
    res.status(404).json('User not found')
  }
})

router.get('/me', async (req, res) => {
  const user = await User.findOne({ _id: req.user.id })
  if (!user) return hError(403, 'Me not found')
  res.json(user)
})


module.exports = router





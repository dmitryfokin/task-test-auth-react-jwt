const mongoose = require('mongoose')
const supertest = require('supertest')
const sign = require('../../helpers/sign')
const app = require('../../app')
const User = require('../../model/user')

const token = `Bearer ${sign({ id: 1 })}`

mongoose.connect(
  'mongodb://127.0.0.1/routes__user', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
)

describe('User routes:', () => {

  let server, request
  beforeAll(() => {
    server = app.listen(3002)
    request = supertest(server)
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async done => {
    await mongoose.connection.close()
    server.close(done)
  })

  it('get user list', async () => {
    await request
      .get('/user/list')
      .set('Authorization', token)
      .expect(200)
  })

  it('get user by valid id', async () => {
    const user = new User({ email: 'test@test.com', password: 'catwalk' })
    const created = await user.save()
    
    await request
      .get(`/user/item/${created._id}`)
      .set('Authorization', token)
      .expect(200)
  })

  it('get user by invalid id', async () => {
    const res = await request
      .get('/user/item/2020')
      .set('Authorization', token)
      .expect(404)

    expect(res.body).toBe('User not found')
  })
})
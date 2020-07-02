const mongoose = require( 'mongoose' )
const supertest = require( 'supertest' )
const sign = require( '../../helpers/sign' )
const app = require( '../../app' )
const User = require( '../../model/user' )

mongoose.connect(
  'mongodb://127.0.0.1/routes__auth',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
)

// Test the JWT authentication
describe( 'Auth routes:', () => {

  let server, request
  beforeAll( () => {
    server = app.listen( 3001 )
    request = supertest( server )
  } )

  beforeEach( async () => {
    await User.deleteMany( {} )
  } )

  afterAll( async done => {
    await mongoose.connection.close()
    server.close( done )
  } )

  // User can successfully sign up
  it( 'sign up', async () => {
    await request
      .post( '/auth/signup' )
      .send( {email: 'test@test.com', password: 'catwalk'} )
      .expect( 200 )

    const user = await User.findOne( {email: 'test@test.com'} )
    expect( user.email ).toBe( 'test@test.com' )
    console.log( 'user.password', user.password )
  } )

  // User can successfully sign in
  it( 'sign in', async () => {
    // const user = new User( {email: 'test@test.com', password: 'catwalk'} )
    // await user.save()
    await request
      .post( '/auth/signup' )
      .send( {email: 'test@test.com', password: 'catwalk'} )

    const {token, refresh} = (await request
      .post( '/auth/signin' )
      .send( {email: 'test@test.com', password: 'catwalk'} )
      .expect( 200 )).body

    expect( typeof token ).toBe( 'string' )
    expect( typeof refresh ).toBe( 'string' )

    // const res = await request
    //   .post('/auth/refresh')
    //   .send({ refresh: refresh })
    //   .expect(200)
    //
    // expect(typeof res.body.token).toBe('string')
    // expect(typeof res.body.refresh).toBe('string')
  } )

  // User gets 403 on invalid credentials
  it( 'sign in with invalid credentials', async () => {
    await request
      .post( '/auth/signin' )
      .send( {email: 'notfound@gmail.com', password: 'notfound'} )
      .expect( 403 )
  } )

  // User receives 401 on expired token
  it( 'request with expired token', async () => {
    const expired = `Bearer ${sign( {id: 1, exp: '1ms'} )}`
    await request
      .get( '/user/list' )
      .set( 'Authorization', expired )
      .expect( 401 )
  } )


  // User can get new access token using refresh token
  it( 'get new access token using refresh', async () => {
    // const user = new User( {email: 'test@test.com', password: 'catwalk'} )
    // await user.save()
    await request
      .post( '/auth/signup' )
      .send( {email: 'test@test.com', password: 'catwalk'} )

    const {refresh} = (await request
      .post( '/auth/signin' )
      .send( {email: 'test@test.com', password: 'catwalk'} )
      .expect( 200 )).body

    const res = await request
      .post( '/auth/refresh' )
      .send( {refresh} )
      .expect( 200 )

    expect( typeof res.body.token ).toBe( 'string' )
    expect( typeof res.body.refresh ).toBe( 'string' )
  } )

  // User get 404 on invalid refresh token
  it( 'with invalid refresh', async () => {
    await request
      .post( '/auth/refresh' )
      .send( {refresh: 'INVALID_REFRESH'} )
      .expect( 404 )
  } )

  // User can use refresh token only once
  it( 'each refresh can be used only once', async () => {
    // const user = new User( {email: 'test@test.com', password: 'catwalk'} )
    // await user.save()
    await request
      .post( '/auth/signup' )
      .send( {email: 'test@test.com', password: 'catwalk'} )

    const {refresh} = (await request
      .post( '/auth/signin' )
      .send( {email: 'test@test.com', password: 'catwalk'} )
      .expect( 200 )).body

    await request
      .post( '/auth/refresh' )
      .send( {refresh} )
      .expect( 200 )

    await request
      .post( '/auth/refresh' )
      .send( {refresh} )
      .expect( 404 )
  } )

  // Refresh tokens become invalid on sign out
  it( 'spoil refresh while sign out', async () => {
    // const user = new User( {email: 'test@test.com', password: 'catwalk'} )
    // await user.save()
    await request
      .post( '/auth/signup' )
      .send( {email: 'test@test.com', password: 'catwalk'} )

    const {token, refresh} = (await request
      .post( '/auth/signin' )
      .send( {email: 'test@test.com', password: 'catwalk'} )
      .expect( 200 )).body

    await request
      .post( '/auth/signout' )
      .set( 'Authorization', `Bearer ${token}` )
      .expect( 200 )

    await request
      .post( '/auth/refresh' )
      .send( {refresh} )
      .expect( 404 )
  } )

  // Multiple refresh tokens are valid
  it( 'multiple refresh', async () => {
    // const user = new User( {email: 'test@test.com', password: 'catwalk'} )
    // await user.save()
    await request
      .post( '/auth/signup' )
      .send( {email: 'test@test.com', password: 'catwalk'} )

    const refreshes = [
      (
        await request
          .post( '/auth/signin' )
          .send( {email: 'test@test.com', password: 'catwalk'} )
          .expect( 200 )
      ).body.refresh,
      (
        await request
          .post( '/auth/signin' )
          .send( {email: 'test@test.com', password: 'catwalk'} )
          .expect( 200 )
      ).body.refresh,
    ]

    await request
      .post( '/auth/refresh' )
      .send( {refresh: refreshes[0]} )
      .expect( 200 )

    await request
      .post( '/auth/refresh' )
      .send( {refresh: refreshes[1]} )
      .expect( 200 )
  } )
} )
const router = require( 'express' ).Router()
const jwtMiddleware = require( 'express-jwt' )
const sign = require( '../helpers/sign' )
const bcrypt = require( 'bcryptjs' )
// const uuid = require('uuid/v4') устарело
const {v4: uuid} = require( 'uuid' );

const User = require( '../model/user' )
const Refresh = require( '../model/refresh' )

const config = require( '../config' )
const hError = require( '../helpers/error' )

const tokens = async ( userId ) => {
  const token = sign( {id: userId} )
  const refresh = uuid()
  await (new Refresh( {
    refresh,
    userId
  } )).save( err => err && console.log( 'Refresh: Error on save!' ) )
  return {token, refresh}
}

router.post( '/signup', async ( req, res ) => {
  try {
    const {email, password} = req.body
    const candidate = await User.findOne( {email} )
    if ( candidate ) return res.status( 400 ).json( {message: 'Such user is already exist'} )

    const hashedPassword = await bcrypt.hash( password, 12 )
    const user = new User( {email, password: hashedPassword} )

    res.json( await user.save() ) // ({ message: 'New user created' })
  } catch {
    res.status( 403 ).json( 'Credentials are not valid' )
  }
} )

router.post( '/signin', async ( req, res ) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne( {email} )
    if ( !user ) return hError( 403, 'User not found' )
    // if ( !bcrypt.compare( password, user.password ) ) return hError( 403, 'Password is invalid' )
    if ( !(await bcrypt.compare( password, user.password )) ) return hError( 403, 'Password is invalid' )
    res.json( await tokens( user.id ) )
  } catch ( e ) {
    res.status( 403 ).json( {message: `Credentials are not valid: ${e.message}`} )
  }
} )

router.post( '/refresh', async ( req, res ) => {
  try {
    const {refresh} = req.body
    const {userId} = await Refresh.findOne( {refresh} )
    if ( !userId ) return res.status( 403 ).json( 'Refresh are not valid' )

    await Refresh.deleteOne( {userId, refresh} )
    res.json( await tokens( userId ) )
  } catch {
    res.status( 404 ).json( 'Refresh are not found' )
  }
} )

router.post( '/signout', jwtMiddleware( {secret: config.jwtSecret} ), async ( req, res ) => {
  await Refresh.deleteMany( {userId: req.user.id} )
  res.json( {success: true} )
} )

module.exports = router

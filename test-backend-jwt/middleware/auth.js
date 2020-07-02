const jwt = require( 'jsonwebtoken' )

module.exports = async ( req, res, next ) => {
  if ( req.method === 'OPTIONS' ) return next()

  try {
    const token = req.headers.authorization.slice( 7 ) // Bearer <token>
    if ( !token ) res.status( 401 ).json( {message: `You are not authorized.`} )

    req.user = jwt.verify( token, process.env.JWT_SECRET )
    next()
  } catch ( e ) {
    res.status( 401 ).json( {message: 'You are not authorized!'} )
  }
}
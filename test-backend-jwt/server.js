const mongoose = require( 'mongoose' )
const config = require( './config' )
const app = require( './app' )

mongoose.connect(
  config.mongo.uri,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
)


module.exports = app.listen( config.port, () => {
  console.log( `Server has been started on port ${config.port}...` )
} )

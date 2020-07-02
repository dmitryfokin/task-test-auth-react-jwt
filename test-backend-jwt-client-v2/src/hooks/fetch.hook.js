import {useCallback, useContext, useState} from 'react'
import {AppContext} from '../context/AppContext'

export const useFetch = () => {
  const [loading, setLoading] = useState( false )
  const [error, setError] = useState( null )
  const appContext = useContext( AppContext )

  const query = useCallback( async ( url = '', method = 'GET', body = null, headers = {}, showLoading = false ) => {
    if ( showLoading ) {
      setLoading( true )
    }

    if ( body ) {
      body = JSON.stringify( body )
      headers['Accept'] = 'application/json'
      headers['Content-Type'] = 'application/json'
    }

    try {
      const response = await fetch(
        `${appContext.config.urlAPI}${url}`,
        {
          method,
          body,
          headers,
        } )
      const data = await response.json()

      if ( !response.ok ) {
        console.log( '!response.ok', data.message )
        setError( data.message )
        throw new Error( data.message || 'что то пошло не так' )
      }

      if ( showLoading ) {
        setLoading( false )
      }
      if ( error ) {
        setError( null )
      }
      return data
    } catch ( e ) {
      console.log( 'query catch', e )
      setLoading( false )
      setError( e.message )
      throw e
    }
  }, [] )

  const post = useCallback( async ( url = '', body = {}, headers = {}, showLoading = false ) => {
    try {
      return await query( url, 'POST', body, headers, showLoading )
    } catch ( e ) {
      console.log( 'post catch', e )
      throw e
    }
  }, [query] )

  const get = useCallback( async ( url = '', headers = {}, showLoading = false ) => {
    try {
      return await query( url, 'GET', null, headers, showLoading )
    } catch ( e ) {
      console.log( 'get catch', e )
      throw e
    }
  }, [query] )

  return {loading, error, query, post, get}
}

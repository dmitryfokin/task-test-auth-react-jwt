import {useCallback, useEffect, useRef, useState} from 'react'
import jwtDecode from 'jwt-decode'
import {useLocation} from 'react-router-dom'
import {useFetch} from './fetch.hook'

const SECURE_DATA = 'secureData'

const isExpired = ( exp ) => {
  if ( !exp ) {
    return true
  }
  return Date.now() > exp * 1000
}

const validTokenData = ( token ) => {
  try {
    const tokenData = jwtDecode( token )
    if ( !tokenData.exp ) {
      return false
    }
    if ( isExpired( tokenData.exp ) ) {
      return false
    }
    return true
  } catch ( e ) {
    console.log( 'validTokenData', e )
    return false
  }
}

export const useAuth = () => {
  const [isAuthentication, setIsAuthentication] = useState( false )
  const [fistRender, setFirstRender] = useState( true )
  const locationPath = useLocation()
  const {post} = useFetch()
  const preLocationPath = useRef()
  const isRefreshed = useRef( false )

  const logout = useCallback( () => {
    setIsAuthentication( false )

    localStorage.removeItem( SECURE_DATA )
    setFirstRender( false )
  }, [] )

  const login = useCallback( ( token, refresh, userId, userName ) => {
    if ( validTokenData( token ) ) {
      localStorage.setItem( SECURE_DATA, JSON.stringify( {
        token,
        refresh,
        userId,
        userName,
      } ) )

      setIsAuthentication( true )
    } else {
      logout()
    }
  }, [logout] )

  const refreshAuth = useCallback( () => {
    const refreshAuthHandler = async () => {
      isRefreshed.current = true
      try {
        const secureData = JSON.parse( localStorage.getItem( SECURE_DATA ) )
        if ( secureData ) {
          const data = await post(
            '/auth/refresh',
            {
              refresh: secureData.refresh,
            },
            {},
            true
          )

          localStorage.setItem( SECURE_DATA, JSON.stringify( {
            token: data.token,
            refresh: data.refresh,
            userId: secureData.userId,
            userName: secureData.userName,
          } ) )
        }
        isRefreshed.current = false
      } catch ( e ) {
        isRefreshed.current = false
      }
    }

    refreshAuthHandler()
  }, [post] )

  const isLoggedIn = useCallback( () => {
    const data = JSON.parse( localStorage.getItem( SECURE_DATA ) )
    if ( data && validTokenData( data.token ) ) {
      return true
    } else {
      return false
    }
  }, [] )

  useEffect( () => {
    const data = JSON.parse( localStorage.getItem( SECURE_DATA ) )
    if ( data && validTokenData( data.token ) ) {
      setIsAuthentication( true )
    } else {
      logout()
    }
    setFirstRender( false )
  }, [logout, isLoggedIn] )

  if ( isAuthentication ) {
    if ( locationPath.pathname !== '/logout' && !isLoggedIn() ) {
      logout()
    }

    if (
      preLocationPath.current !== locationPath.key
      && !isRefreshed.current
    ) {
      refreshAuth()
    }
  }

  preLocationPath.current = locationPath.key

  return {
    login,
    logout,
    refreshAuth,
    isLoggedIn,
    isAuthentication,
    fistRender,
    SECURE_DATA,
  }
}

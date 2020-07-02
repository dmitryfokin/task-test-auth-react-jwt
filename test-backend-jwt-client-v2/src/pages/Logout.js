import React, {useContext, useEffect} from 'react'
import {AppContext} from '../context/AppContext'
import {useHistory} from 'react-router-dom'

const Logout = () => {
  const appContext = useContext( AppContext )
  const history = useHistory()

  useEffect( () => {
    appContext.auth.logout()
    history.push( '/' )
  } )

  return (
    <></>
  )
}

export default Logout

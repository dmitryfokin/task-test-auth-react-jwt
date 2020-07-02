import React, {useCallback, useContext, useEffect, useState} from 'react'
import './Users.css'
import {useFetch} from '../../hooks/fetch.hook'
import {AppContext} from '../../context/AppContext'
import Loader from '../../conponents/UI/Loader/Loader'

const Users = props => {
  const {loading, error, get} = useFetch()
  const appContext = useContext( AppContext )
  const {SECURE_DATA} = appContext.auth
  const [users, setUsers] = useState( [] )

  const getUsers = useCallback( async () => {
    const secureData = JSON.parse( localStorage.getItem( SECURE_DATA ) )
    if ( secureData ) {
      try {
        const data = await get(
          '/user/list',
          {
            Authorization: `Bearer ${secureData.token}`
          },
          true
        )
        setUsers( data )
      } catch ( e ) {
      }
    }
  }, [SECURE_DATA, get] )

  useEffect( () => {
    getUsers()
  }, [getUsers] )

  return (
    <div className={'Users'}>
      <h1>Список пользователей</h1>
      {loading && <div className={'Loader'}><Loader/></div>}
      <ul>
        {users.map( user => (
          <li
            key={user._id}
          >
            {user.email}
          </li>
        ) )}
      </ul>
    </div>
  )
}

export default Users

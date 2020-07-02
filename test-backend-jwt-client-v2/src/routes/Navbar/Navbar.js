import React, {useContext} from 'react'
import './Navbar.css'
import {NavLink} from 'react-router-dom'
import {AppContext} from '../../context/AppContext'

const Navbar = props => {
  const appContext = useContext( AppContext )

  if ( appContext.auth.isAuthentication ) {
    return (
      <div className={'Navbar'}>
        <ul>
          <li>
            <NavLink to={'/'}>Главная</NavLink>
          </li>
          <li>
            <NavLink to={'/users'}>Пользователи</NavLink>
          </li>
          <li>
            <NavLink to={'/logout'}>Выход</NavLink>
          </li>
        </ul>
      </div>
    )
  } else {
    return (
      <div className={'Navbar'}>
        <ul>
          <li>
            <NavLink to={'/'}>Главная</NavLink>
          </li>
          <li>
            <NavLink to={'/login'}>Вход/Регистрация</NavLink>
          </li>
        </ul>
      </div>
    )
  }
}

export default Navbar

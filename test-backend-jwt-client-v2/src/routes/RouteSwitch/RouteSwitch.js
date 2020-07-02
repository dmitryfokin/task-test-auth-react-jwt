import React, {useContext} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Home from '../../pages/Home/Home'
import Login from '../../pages/Login/Login'
import Users from '../../pages/Users/Users'
import {AppContext} from '../../context/AppContext'
import Logout from '../../pages/Logout'

const RouteSwitch = ( {isAuthentication} ) => {
  const appContext = useContext( AppContext )

  if ( appContext.auth.fistRender ) {
    return (
      <></>
    )
  }

  if ( isAuthentication ) {
    return (
      <Switch>
        <Route
          exact
          path={'/'}
        >
          <Home/>
        </Route>
        <Route
          path={'/users'}
        >
          <Users/>
        </Route>
        <Route
          path={'/logout'}
        >
          <Logout/>
        </Route>
        <Redirect
          to={'/'}
        />
      </Switch>
    )
  } else {
    return (
      <Switch>
        <Route
          exact
          path={'/'}
        >
          <Home/>
        </Route>
        <Route
          path={'/login'}
        >
          <Login/>
        </Route>
        <Redirect
          to={'/'}
        />
      </Switch>
    )
  }
}

export default RouteSwitch
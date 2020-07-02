import React, {useMemo} from 'react'
import './App.css'
import {AppContext} from './context/AppContext'
import {useAuth} from './hooks/auth.hook'
import MainLayout from './layouts/MainLayout/MainLayout'
import RouteSwitch from './routes/RouteSwitch/RouteSwitch'

function App() {
  const auth = useAuth()

  const routeSwitch = useMemo( () => {
    return (
      <RouteSwitch
        isAuthentication={auth.isAuthentication}
      />
    )
  }, [auth.isAuthentication] )

  if ( auth.fistRender ) {
    return (
      <></>
    )
  }

  return (
    <AppContext.Provider value={
      {
        auth: {...auth},
        config: {...AppContext._currentValue.config}
      }
    }>
      <MainLayout
        page={routeSwitch}
      />
    </AppContext.Provider>
  )
}

export default App

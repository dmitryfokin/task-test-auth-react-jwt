import {createContext} from 'react'

function noop() {
}

export const AppContext = createContext( {
  auth: {
    login: noop(),
    logout: noop(),
    isLoggedIn: noop(),
    isAuthentication: false,
    fistRender: true,
    SECURE_DATA: '',
  },
  config: {
    urlAPI: 'http://localhost:4200',
  }
} )

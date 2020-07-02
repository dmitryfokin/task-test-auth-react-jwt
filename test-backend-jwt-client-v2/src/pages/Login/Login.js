import React, {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import './Login.css'
import {AppContext} from '../../context/AppContext'
import Input from '../../conponents/UI/Input/Input'
import {useFetch} from '../../hooks/fetch.hook'
import Loader from '../../conponents/UI/Loader/Loader'
import {useStateFormData} from '../../hooks/formData.hook'
import Button from '../../conponents/UI/Button/Button'

const Login = props => {
  const appContext = useContext( AppContext )
  const history = useHistory()
  const {loading, error, post, get} = useFetch()
  const [showErrorForm, setShowErrorForm] = useState( false )
  const [message, setMessage] = useState( '' )
  const [formData, errorForm, setFormData] = useStateFormData( {
    email: {
      type: 'email',
      label: 'e-mail',
      value: '',
      valueDefault: '',
      name: 'email',
      placeholder: 'Введите e-mail',
      errorMessage: 'Введите корректный e-mail',
      valid: false,
      touched: false,
      validation: {
        required: true,
        email: true,
      },
    },
    password: {
      type: 'password',
      label: 'Пароль',
      value: '',
      valueDefault: '',
      name: 'password',
      placeholder: 'Введите пароль',
      errorMessage: 'Введите корректный пароль',
      valid: false,
      touched: false,
      validation: {
        required: true,
        minLength: 6,
      },
    },
  } )

  const handlerLogin = async ( e ) => {
    e.preventDefault()

    try {
      const data = await post(
        '/auth/signin',
        {
          email: formData.email.value,
          password: formData.password.value,
        },
        {},
        true
      )

      const user = await get(
        '/user/me',
        {
          Authorization: `Bearer ${data.token}`
        },
        true
      )

      appContext.auth.login(
        data.token,
        data.refresh,
        user._id,
        user.email
      )
      history.push( '/users' )
    } catch ( e ) {
      console.log( 'handlerLogin', e )
    }
  }

  const handlerRegistration = async ( e ) => {
    e.preventDefault()

    if ( errorForm ) {
      setShowErrorForm( true )
      return
    }

    try {
      await post(
        '/auth/signup',
        {
          email: formData.email.value,
          password: formData.password.value,
        },
        {},
        true
      )

      setFormData.clearForm()
      setMessage( 'Вы успешно зарегистрировались' )
    } catch ( e ) {
      console.log( 'handlerRegistration', e )
    }
  }

  const handlerChangeFormData = ( value, name ) => {
    setFormData.setValue( name, value )
  }

  return (
    <div className={'Login'}>
      {(!!error || (showErrorForm && errorForm)) &&
      (<div className={'message error_message'}>
        {errorForm}
        {(<hr/>)}
        {error}
      </div>)
      }
      {message && (<div className={'message'}>
        {message}
      </div>)}
      {loading && <div className={'Loader'}><Loader/></div>}
      <form onSubmit={e => e.preventDefault()}>
        <Input
          fieldDate={formData.email}
          onChange={handlerChangeFormData}
        />
        <Input
          fieldDate={formData.password}
          onChange={handlerChangeFormData}
        />
        <div className={'btn-wrapper'}>
          <Button
            name={'Войти'}
            onClick={handlerLogin}
          />
          <Button
            name={'Регистрация'}
            onClick={handlerRegistration}
          />
        </div>
      </form>
    </div>
  )
}

export default Login

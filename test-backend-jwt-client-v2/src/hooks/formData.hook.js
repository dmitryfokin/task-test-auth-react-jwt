import {useState} from 'react'
import is from 'is_js'

export const useStateFormData = ( initialState = {} ) => {
  const [state, setStateFormData] = useState( initialState )
  const [errorForm, setErrorForm] = useState( null )

  const validateFieldValue = fieldDate => {
    if ( !fieldDate.validation ) {
      return [true, '']
    }

    let isValid = true
    let errorMessage = ''

    if (
      fieldDate.validation.required
      && is.empty( fieldDate.value.trim() )
    ) {
      errorMessage += 'не может быть пустым'
      isValid = false
    }

    if (
      fieldDate.validation.email
      && is.not.email( fieldDate.value )
    ) {
      errorMessage += 'не корректный e-mail'
      isValid = false
    }

    if (
      fieldDate.validation.minLength
      && is.above( fieldDate.validation.minLength, fieldDate.value.length )
    ) {
      errorMessage += `значение должно быть больше ${fieldDate.validation.minLength} символов`
      isValid = false
    }

    return [isValid, errorMessage]
  }

  const setValue = ( fieldName, value ) => {
    const newState = {...state}
    const fieldData = {...newState[fieldName]}

    fieldData.value = value
    fieldData.touched = true

    const [valid, errorMessage] = validateFieldValue( fieldData )
    fieldData.valid = valid
    fieldData.errorMessage = errorMessage

    newState[fieldName] = {
      ...fieldData
    }

    setStateFormData( {
      ...newState
    } )

    let isValidForm = true
    Object.keys( newState ).forEach( fieldName => {
      if ( !newState[fieldName].valid ) {
        isValidForm = false
      }
    } )

    if ( errorForm && isValidForm ) {
      setErrorForm( null )
    } else if ( !errorForm && !isValidForm ) {
      setErrorForm( 'Ошибка данных формы' )
    }
  }

  const clearForm = () => {
    const newState = {...state}

    Object.keys( newState ).forEach( fieldName => {
      newState[fieldName].value = newState[fieldName].valueDefault
      newState[fieldName].valid = false
      newState[fieldName].touched = false
      newState[fieldName].errorMessage = ''
    } )

    setStateFormData( newState )
    setErrorForm( null )
  }

  return [state, errorForm, {setValue, clearForm}]
}

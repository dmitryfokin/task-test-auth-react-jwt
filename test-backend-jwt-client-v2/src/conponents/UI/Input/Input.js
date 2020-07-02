import React from 'react'
import './Input.css'

const Input = ( {fieldDate, onChange} ) => {
  return (
    <div className={'Input'}>
      <label>
        {fieldDate.label || '>'}
        <input
          type={fieldDate.type}
          name={fieldDate.name}
          value={fieldDate.value || ''}
          placeholder={fieldDate.placeholder || ''}
          onChange={e => onChange( e.target.value, fieldDate.name )}
        />
      </label>
      {
        !fieldDate.valid && fieldDate.touched
          ? <div className={'input-error'}>
            {fieldDate.errorMessage}
          </div>
          : null
      }
    </div>
  )
}

export default Input

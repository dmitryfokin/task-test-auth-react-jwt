import React from 'react'
import './MainLayout.css'
import Navbar from '../../routes/Navbar/Navbar'

const MainLayout = props => {
  return (
    <div className={'MainLayout'}>
      <header>
        <Navbar/>
      </header>
      <main>
        {props.page}
      </main>
    </div>
  )
}

export default MainLayout

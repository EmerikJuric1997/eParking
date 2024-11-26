import React from 'react'
import RegisterComponent from '../../../components/AuthForm/RegisterComponent/RegisterComponent'
import transition from '../../../services/transition'
import Store from '../../../store/Store'
import NotFound from '../../Main/NotFound/NotFound'

function RegisterPage() {
  return (
    <div>
      {Store.user === null ? <RegisterComponent /> : <NotFound />}
    </div>
  )
}

export default transition(RegisterPage)
import React from 'react'
import RegisterComponent from '../../../components/AuthForm/RegisterComponent/RegisterComponent'
import transition from '../../../services/transition'

function RegisterPage() {
  return (
    <div>
      <RegisterComponent />
    </div>
  )
}

export default transition(RegisterPage)
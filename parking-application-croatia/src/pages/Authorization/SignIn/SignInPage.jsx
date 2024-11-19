import React from 'react'
import SignInComponent from '../../../components/AuthForm/SignInComponent/SignInComponent'
import transition from '../../../services/transition'

function SignInPage() {
  return (
    <div>
      <SignInComponent />
    </div>
  )
}

export default transition(SignInPage)

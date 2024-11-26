import React from 'react'
import SignInComponent from '../../../components/AuthForm/SignInComponent/SignInComponent'
import transition from '../../../services/transition'
import NotFound from '../../Main/NotFound/NotFound'
import Store from '../../../store/Store'

function SignInPage() {
  return (
    <div>
            {Store.user === null ? <SignInComponent /> : <NotFound />}
    </div>
  )
}

export default transition(SignInPage)

import React from 'react'
import UserComponent from '../../components/User/UserComponent'
import transition from '../../services/transition'

function UserPage() {
  return (
    <div>
      <UserComponent />
    </div>
  )
}

export default transition(UserPage)

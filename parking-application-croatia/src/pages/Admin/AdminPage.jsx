import React from 'react'
import AdminComponent from '../../components/Admin/AdminComponent'
import transition from '../../services/transition'

function AdminPage() {
  return (
    <div>
      <AdminComponent />
    </div>
  )
}

export default transition(AdminPage)

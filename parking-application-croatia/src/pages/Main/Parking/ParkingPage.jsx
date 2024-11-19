import React from 'react'
import ParkingComponent from '../../../components/Parking/ParkingComponent'
import transition from '../../../services/transition'

 function ParkingPage() {
  return (
    <div>
      <ParkingComponent />
    </div>
  )
}

export default transition(ParkingPage)
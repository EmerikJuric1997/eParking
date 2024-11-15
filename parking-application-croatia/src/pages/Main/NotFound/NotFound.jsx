import React from 'react'
import { useNavigate } from 'react-router-dom';
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className='error-container'>
    <div>
      <img src="/assets/404.png" alt="404 image" />
    </div>
    <div>
    <h1 className='error-back' onClick={() => navigate(-1)}>Klikni za povratak</h1>
    </div>
    </div>
  )
}

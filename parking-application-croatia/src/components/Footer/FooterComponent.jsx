import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import "./FooterComponent.css"

export default function FooterComponent() {

  const dateModel = new Date();
  let currentDate = dateModel.getFullYear();

  return (
    <div className='footer-container'>
      <div className='container-box'>
        <a href='http://www.fina.hr'>
          Financijska agencija
        </a>
      </div>
      <div className='container-box'>
        <p>
          Emerik Jurić {currentDate}
        </p>
      </div>
      <div className='container-box'>
        <a href='https://www.facebook.com/profile.php?id=100007123185072'><FaFacebook className="footer-icon" /></a>
        <a href='https://www.instagram.com/emerik.juric97/'><FaInstagram className="footer-icon" /></a>
        <a href='https://www.linkedin.com/in/emerikjuri%C4%87'><FaLinkedin className="footer-icon" /></a>
      </div>
    </div>
  )
}

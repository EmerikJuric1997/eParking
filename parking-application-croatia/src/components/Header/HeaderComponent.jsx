import { useState } from 'react';
import './HeaderComponent.css'
import { Link } from 'react-router-dom';

export default function HeaderComponent() {
  const [user, setUser] = useState(true);
  const [admin, setAdmin] = useState(true)
  const [userModal, setUserModal] = useState(false)

  const toggleUserModal = () => {
    setUserModal(!userModal);
  }

  return (
    <>
      <div className='navigation'>
        <div>
          <Link to="/" className='home-button'>
            <img src="/assets/logo.png" alt="Application logo" className="header-logo-image" />
            eParking
          </Link>
        </div>
        {!user &&
          <div className='sign-in-div'>
            <Link to="/signin" className='sign-in-button'>
              Prijavi se
            </Link>
          </div>}
        {user &&
          <div>
            <img className="profile-picture" src="https://scontent.fzag4-1.fna.fbcdn.net/v/t39.30808-6/417509472_3648645118716225_4509178964389876782_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHKWerc2eUExFoOPBYJxaHjB9RmkEeNHEQH1GaQR40cRBiVdZbnoc5pBJyvv_HuGYjNuGe5BiEEHFIw-kCZNA-2&_nc_ohc=aESyReestaoQ7kNvgGOzm8B&_nc_zt=23&_nc_ht=scontent.fzag4-1.fna&_nc_gid=ADja5RRNdrZCoS5SYj2tL3M&oh=00_AYAD6x0T1y8zIHxbKlRGDxlPz3iAwwTh85D_Esn1azhPsA&oe=673BBBF9" alt="Profile picture" onClick={toggleUserModal} />
          </div>}
      </div>
      {userModal && (
        <div className='user-modal' onClick={toggleUserModal}>
          <Link to="/user/:id" className='user-item'>
            <div>
              Profil
            </div>
          </Link>
          <Link to="/parking/:id" className='user-item'>
            <div>
              Parking
            </div>
          </Link>
          {admin && (<>
            <Link to="/admin" className='user-item'>
              <div>
                Admin
              </div>
            </Link>
            <Link to="/camera" className='user-item'>
              <div>
                Kamera
              </div>
            </Link>
          </>
          )}
          <Link to="/" className='user-item'>
            <div>
              Odjavi se
            </div>
          </Link>
        </div>)}
    </>
  )
}

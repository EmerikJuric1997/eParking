import { useState } from 'react';
import './HeaderComponent.css'
import { Link } from 'react-router-dom';
import Store from '../../store/Store';
import { observer } from 'mobx-react-lite';

const HeaderComponent = observer(() => {
  const [admin, setAdmin] = useState(false)
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
        {Store.isAuthenticated === false &&
          <div className='sign-in-div'>
            <Link to="/signin" className='sign-in-button'>
              Prijavi se
            </Link>
          </div>}
        {Store.isAuthenticated === true &&
          <div>
            <img className="profile-picture" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile picture" onClick={toggleUserModal} />
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
            <div onClick={() => Store.logout()}>
              Odjavi se
            </div>
          </Link>
        </div>)}
    </>
  )
}
)

export default HeaderComponent;

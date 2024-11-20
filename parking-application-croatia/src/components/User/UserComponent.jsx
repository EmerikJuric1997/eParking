import React, { useState, useEffect } from 'react'
import './UserComponent.css'
import transition from '../../services/transition';
import Store from '../../store/Store';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';

const UserComponent = observer(() => {

    let { id } = useParams();
    const [isActive, setIsActive] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            Store.profileImage = file; // Save file in the MobX store
            // Generate a preview for immediate display
            const reader = new FileReader();
            reader.onloadend = () => {
                Store.setProfileImagePreview(reader.result); // Save preview URL
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        Store.fetchUserById(id)
    }, [])

    const updateUserInfo = () => {
        setIsActive(!isActive);
        Store.updateUser(id);
    }
    const changeInput = () => {
        setIsActive(!isActive)
    }

    return (
        <>
            {Store.user && (
                <>
                    <div className='user-container'>
                        <div className='user-container-background'>
                            <div className='image-container'>
                                <label>
                                    <input disabled={!isActive} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                                    { Store.profileImagePreview && <img className='user-profile-picture' src={Store.profileImagePreview} alt="Profile picture preview" /> }
                                    { !Store.profileImagePreview && <img className='user-profile-picture' src={`/src/services${Store.user.profileimage}`} alt='Profile picture' /> }
                                </label>
                            </div>
                            <div>
                                <p className='input-heading'>E-mail</p>
                                <input disabled={!isActive} className='user-change-input' type='text' value={Store.username} onChange={(e) => Store.username = e.target.value}>
                                </input>
                            </div>
                            <div>
                                <p className='input-heading'>Ime</p>
                                <input disabled={!isActive} className='user-change-input' value={Store.name} type='text' onChange={(e) => Store.name = e.target.value}>
                                </input>
                            </div>
                            <div>
                                <p className='input-heading'>Registracija</p>
                                <input disabled={!isActive} className='user-change-input' type='text' value={Store.licensePlate} onChange={(e) => Store.licensePlate = e.target.value}>
                                </input>
                            </div>
                            <div>
                                {isActive === false && <button className='user-component-button' onClick={changeInput}>Uredi</button>}
                                {isActive === true && <button className='user-component-button' onClick={updateUserInfo}>Spremi</button>}
                            </div>
                        </div>
                        <div className='user-container-receipt'>
                            <h1>Računi</h1>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Datum</th>
                                        <th>Registracija</th>
                                        <th>Zona</th>
                                        <th>Vrijeme</th>
                                        <th>Uredi</th>
                                    </tr>
                                    <tr>
                                        <td>24.11.2024.</td>
                                        <td>OS345HA</td>
                                        <td>1</td>
                                        <td>12:39</td>
                                        <td><button className='table-component-button-delete'>Obriši</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='user-container-two'>
                        <div className='user-container-fine'>
                            <h1>Kazne</h1>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Datum</th>
                                        <th>Registracija</th>
                                        <th>Zona</th>
                                        <th>Uplaćeno</th>
                                        <th>Neplaćeno</th>
                                        <th>Uredi</th>
                                    </tr>
                                    <tr>
                                        <td>24.12.2024</td>
                                        <td>OS550KB</td>
                                        <td>2</td>
                                        <td>2h 20min</td>
                                        <td><button className='table-component-button-pay'>Plati</button></td>
                                        <td><button className='table-component-button-delete'>Obriši</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div></>
            )}

        </>
    )
}
)

export default transition(UserComponent)

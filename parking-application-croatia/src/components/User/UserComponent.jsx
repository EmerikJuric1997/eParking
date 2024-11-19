import React, { useState } from 'react'
import './UserComponent.css'
import transition from '../../services/transition';

function UserComponent() {

    const [isActive, setIsActive] = useState(false);

    const changeInput = () => {
        setIsActive(!isActive)
    }

    return (
        <>
            <div className='user-container'>
                <div className='user-container-background'>
                    <div className='image-container'>
                        <label>
                            <input type="file" style={{ display: "none" }} />
                            <img className='user-profile-picture' src="https://scontent.fzag4-1.fna.fbcdn.net/v/t39.30808-6/417509472_3648645118716225_4509178964389876782_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHKWerc2eUExFoOPBYJxaHjB9RmkEeNHEQH1GaQR40cRBiVdZbnoc5pBJyvv_HuGYjNuGe5BiEEHFIw-kCZNA-2&_nc_ohc=aESyReestaoQ7kNvgGOzm8B&_nc_zt=23&_nc_ht=scontent.fzag4-1.fna&_nc_gid=ADja5RRNdrZCoS5SYj2tL3M&oh=00_AYAD6x0T1y8zIHxbKlRGDxlPz3iAwwTh85D_Esn1azhPsA&oe=673BBBF9" alt="Profile picture" />
                        </label>
                    </div>
                    <div>
                        <p className='input-heading'>Ime</p>
                        <input disabled={!isActive} className='user-change-input'>
                        </input>
                    </div>
                    <div>
                        <p className='input-heading'>Prezime</p>
                        <input disabled={!isActive} className='user-change-input'>
                        </input>
                    </div>
                    <div>
                        <p className='input-heading'>Lozinka</p>
                        <input disabled={!isActive} className='user-change-input' type='password'>
                        </input>
                    </div>
                    <div>
                        {isActive === false && <button className='user-component-button' onClick={changeInput}>Uredi</button>}
                        {isActive === true && <button className='user-component-button'>Spremi</button>}
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
            </div>
        </>
    )
}

export default transition(UserComponent)

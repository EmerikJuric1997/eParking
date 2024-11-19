import React from 'react';
import './AdminComponent.css'

export default function AdminComponent() {
    return (
        <div className='admin-container-background'>
            <div className='admin-container'>
                <div>
                    <h1>Administrator</h1>
                </div>
                <div>
                    <select name="filter" id="users" className='admin-dropdown'>
                        <option value="volvo">Ime</option>
                        <option value="saab">Prezime</option>
                        <option value="mercedes">Registracija</option>
                    </select>
                    <input placeholder='Unesite ime korisnika' className='admin-input'></input>
                    <button className='admin-search-button'>Pretraži</button>
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <th>Ime</th>
                                <th>Prezime</th>
                                <th>E-mail</th>
                                <th>Lozinka</th>
                                <th>Uloga</th>
                                <th>Registracijska oznaka</th>
                                <th>Uredi</th>
                            </tr>
                            <tr>
                                <td>Emerik</td>
                                <td>Jurić</td>
                                <td>emerik.juric@gmail.com</td>
                                <td>fdiohn4345</td>
                                <td>Korisnik</td>
                                <td>OS345HA</td>
                                <td><button className='table-component-button-save'>Uredi</button>
                                    <button className='table-component-button-delete'>Obriši</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

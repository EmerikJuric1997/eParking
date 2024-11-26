import React, { useEffect } from 'react';
import './AdminComponent.css'
import Store from '../../store/Store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

const AdminComponent = observer(() => {
    
    useEffect(() => {
        if (Store.licensePlateSeach === '') {
            Store.fetchAllUsers();
        }
        Store.fetchAllReceipts();
        Store.getTotalIncome();
    }, [Store.licensePlateSeach])

    return (
        <>
            <div className='admin-container-background'>
                <div className='admin-container'>
                    <div>
                        <h1>Administrator</h1>
                    </div>
                    <div>
                        <input placeholder='Unesite tablicu korisnika' className='admin-input' value={Store.licensePlateSeach} onInput={(e) => runInAction(() => { Store.licensePlateSeach = e.target.value })}></input>
                        <button onClick={() => Store.fetchAllUsersByPlate()} className='admin-search-button'>Pretraži</button>
                    </div>
                    <div>
                        {Store.allUsers && <table>
                            <tbody>
                                <tr>
                                    <th>Ime</th>
                                    <th>Prezime</th>
                                    <th>E-mail</th>
                                    <th>Uloga</th>
                                    <th>Registracijska oznaka</th>
                                    <th>Uredi</th>
                                </tr>

                                {Store.allUsers.map(user => (<tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.licenseplate}</td>
                                    <td>
                                        <button onClick={() => Store.deleteUser(user.id)} className='table-component-button-delete'>
                                            Obriši
                                        </button>
                                    </td>
                                </tr>))}
                            </tbody>
                        </table>}
                    </div>
                    <div>
                        <h2 className='income'>Ukupni prihodi: {Store.totalIncome}€</h2>
                    </div>
                </div>
            </div >
        </>
    )
})

export default AdminComponent
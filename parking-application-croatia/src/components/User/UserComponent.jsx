import React, { useState, useEffect } from 'react'
import './UserComponent.css'
import transition from '../../services/transition';
import Store from '../../store/Store';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import NotFound from '../../pages/Main/NotFound/NotFound';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {runInAction} from 'mobx'

const UserComponent = observer(() => {

    let { id } = useParams();
    const [isActive, setIsActive] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            Store.profileImage = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                Store.setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        Store.fetchUserById(id);
        Store.fetchUserReceipt();
        Store.fetchUserFine();
        Store.fetchPayedFines();
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
            {Store.user.id === id && (
                <>
                    <div className='user-container'>
                        <div className='user-container-background'>
                            <div className='image-container'>
                                <label>
                                    <input disabled={!isActive} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                                    {Store.profileImagePreview && <img className='user-profile-picture' src={Store.profileImagePreview} alt="Profile picture preview" />}
                                    {!Store.profileImagePreview && <img className='user-profile-picture' src={`/src/services${Store.user.profileimage}`} alt='Profile picture' />}
                                </label>
                            </div>
                            <div>
                                <p className='input-heading'>E-mail</p>
                                <input disabled={!isActive} className='user-change-input' type='text' value={Store.username} onChange={(e) => runInAction(() => {Store.username = e.target.value})}>
                                </input>
                            </div>
                            <div>
                                <p className='input-heading'>Ime</p>
                                <input disabled={!isActive} className='user-change-input' value={Store.name} type='text' onChange={(e) => runInAction(() => {Store.name = e.target.value})}>
                                </input>
                            </div>
                            <div>
                                <p className='input-heading'>Registracija</p>
                                <input disabled={!isActive} className='user-change-input' type='text' value={Store.licensePlate} onChange={(e) => runInAction(() => {Store.licensePlate = e.target.value})}>
                                </input>
                            </div>
                            <div>
                                {isActive === false && <button className='user-component-button' onClick={changeInput}>Uredi</button>}
                                {isActive === true && <button className='user-component-button-save' onClick={updateUserInfo}>Spremi</button>}
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
                                    {Store.userReceipts.map(receipt => (
                                        <tr key={receipt.id}>
                                            <td>{receipt.receipt_date}</td>
                                            <td>{receipt.license_plate}</td>
                                            <td>{receipt.zone}</td>
                                            <td>{receipt.expire_date}</td>
                                            <td>{new Date(receipt.expire_date) < new Date() &&
                                                <button onClick={() => Store.deleteReceipt(receipt.id)} className='table-component-button-delete'>Obriši</button>}</td>
                                        </tr>
                                    ))}
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
                                        <th>Cijena</th>
                                        <th>Neplaćeno</th>
                                        <th>Uredi</th>
                                    </tr>
                                    {Store.userFines.map(fine => (
                                        <tr key={fine.id}>
                                            <td>{fine.fine_date}</td>
                                            <td>{fine.license_plate}</td>
                                            <td>{fine.zone}</td>
                                            <td>{fine.price} €</td>
                                            <td>{fine.paid === '0' &&
                                                <PayPalScriptProvider options={{ "client-id": "Aa8dCOAzeAsT2UBtv8ASK7xs8yQPW5KblGMYrVPufVdhovncITOVauX0QDZQWimJoU6QLVzQzRPFwvdX" }}>
                                                    <PayPalButtons
                                                        style={{
                                                            layout: 'horizontal',
                                                            color: 'blue',
                                                            shape: 'rect',
                                                            label: 'paypal',
                                                            height: 40
                                                        }}
                                                        createOrder={(data, actions) => {
                                                            return actions.order.create({
                                                                purchase_units: [{
                                                                    amount: {
                                                                        value: 10
                                                                    },
                                                                }],
                                                            });
                                                        }}
                                                        onApprove={(data, actions) => {
                                                            return actions.order.capture().then((details) => {
                                                                Store.finePayment(fine.price, fine.license_plate, fine.zone)
                                                                Store.updateFine(fine.id);
                                                            });
                                                        }}
                                                    />
                                                </PayPalScriptProvider>}</td>
                                            <td>{fine.paid === '1' &&
                                                <button onClick={() => Store.deleteFine(fine.id)} className='table-component-button-delete'>Obriši</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div></>
            )}
            {Store.user.id !== id &&
                <NotFound />
            }
        </>
    )
}
)

export default transition(UserComponent)

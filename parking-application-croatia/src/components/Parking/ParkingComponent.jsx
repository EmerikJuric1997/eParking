import { useEffect } from 'react';
import { useParams } from 'react-router';
import './ParkingComponent.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Store from '../../store/Store';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import NotFound from '../../pages/Main/NotFound/NotFound';


const ParkingComponent = observer(() => {

    let { id } = useParams();


    useEffect(() => {
        Store.fetchUserById(id);
        Store.fetchLastReceipt();
    }, [])


    useEffect(() => {
        if (Store.totalSeconds === 0) {
            Store.fetchLastReceipt();
        }
    }, [Store.totalSeconds])

    useEffect(() => {
        Store.getPayment();
    }, [Store.hour, Store.minute, Store.zone, Store.price, Store.activeId])

    return (
        <>
            {Store.user.id === id &&
                <div className='parking-background'>
                    <div className='parking-container'>
                        <div className='parking-box'>
                            <div className='parking-time'>
                                <div>
                                    <p className='parking-text'>
                                        Preostalo vrijeme parkinga:
                                    </p>
                                </div>
                                <div>
                                    {Store.lastReceipt && Store.totalSeconds !== 0 &&
                                        <h1 className='parking-timer'>
                                            {Store.hourCount}h {Store.minuteCount}min {Store.secondCount}s
                                        </h1>}
                                    {((Store.totalSeconds === 0) || !Store.lastReceipt) &&
                                        <h1 className='parking-timer-zero'>
                                            0h 0min 0s
                                        </h1>}
                                </div>
                                <div>
                                    {Store.lastReceipt && Store.totalSeconds !== 0 && <h1>
                                        Zona: {Store.zoneReceipt}
                                    </h1>}
                                </div>
                                <div>
                                    {Store.lastReceipt && Store.totalSeconds !== 0 && <h3>
                                        {Store.platePayment}
                                    </h3>}
                                </div>
                            </div>
                        </div>
                        <div className='parking-box'>
                            <div className='parking-payment-box'>
                                <div>
                                    <h1>Nadoplati parking</h1>
                                </div>
                                <div className='parking-input-box'>
                                    <input
                                        placeholder='Unesite broj sati'
                                        className='parking-input'
                                        type="number"
                                        name="hour"
                                        min={0}
                                        value={Store.hour}
                                        onChange={(e) => runInAction(() => { Store.hour = Number(e.target.value) })}
                                    />
                                    <input
                                        placeholder='Unesite broj minuta'
                                        className='parking-input'
                                        type="number"
                                        name="minute"
                                        min={0}
                                        value={Store.minute}
                                        onChange={(e) => runInAction(() => { Store.minute = Number(e.target.value) })}
                                    /><p></p>
                                </div>
                                <div>
                                    <p>
                                        Odaberite zonu:
                                    </p>
                                </div>
                                <div className='parking-zone'>
                                    <div className='parking-zone-checkbox'>
                                        <input type="checkbox" id="checkbox-1" name="1" value={1} onInput={(e) => runInAction(() => { Store.zone = parseInt(e.target.value) })} onChange={(e) => runInAction(() => { Store.activeId = Store.activeId === 1 ? null : Number(e.target.value); })} disabled={Store.activeId !== null && Store.activeId !== 1} checked={Store.activeId === 1} />
                                        <label> Zona 1</label>
                                    </div>
                                    <div className='parking-zone-checkbox'>
                                        <input type="checkbox" id="checkbox-2" name="2" value={2} onInput={(e) => runInAction(() => { Store.zone = parseInt(e.target.value) })} onChange={(e) => runInAction(() => { Store.activeId = Store.activeId === 2 ? null : Number(e.target.value); })} disabled={Store.activeId !== null && Store.activeId !== 2} checked={Store.activeId === 2} />
                                        <label> Zona 2</label>
                                    </div>
                                    <div className='parking-zone-checkbox'>
                                        <input type="checkbox" id="checkbox-3" name="3" value={3} onInput={(e) => runInAction(() => { Store.zone = parseInt(e.target.value) })} onChange={(e) => runInAction(() => { Store.activeId = Store.activeId === 3 ? null : Number(e.target.value); })} disabled={Store.activeId !== null && Store.activeId !== 3} checked={Store.activeId === 3} />
                                        <label> Zona 3</label>
                                    </div>
                                </div>
                                <div>
                                    <p>
                                        Odaberite registracijsku oznaku:
                                    </p>
                                </div>
                                <div className='parking-zone'>
                                    <div className='parking-zone-checkbox'>
                                        <input type="checkbox" id="checkbox-4" name="my-plate" value={Store.platePayment} onChange={() => runInAction(() => { Store.platePayment = Store.platePayment === Store.user.licenseplate ? '' : Store.user.licenseplate; })} disabled={Store.platePayment !== '' && Store.platePayment !== Store.user.licenseplate} checked={Store.platePayment === Store.user.licenseplate} />
                                        <label>{Store.user.licenseplate}</label>
                                    </div>
                                    {Store.user.spareplate &&
                                        <div className='parking-zone-checkbox'>
                                            <input type="checkbox" id="checkbox-5" name="my-plate" value={Store.platePayment} onChange={() => runInAction(() => { Store.platePayment = Store.platePayment === Store.user.spareplate ? '' : Store.user.spareplate; })} disabled={Store.platePayment !== '' && Store.platePayment !== Store.user.spareplate} checked={Store.platePayment === Store.user.spareplate} />
                                            <label>{Store.user.spareplate}</label>
                                        </div>
                                    }
                                    <div className='parking-zone-checkbox'>
                                        <input className='parking-input' id="input-1" placeholder='Druga tablica' name="other-plate" value={Store.platePayment} onInput={(e) => runInAction(() => { Store.platePayment = e.target.value; })} disabled={Store.platePayment !== '' && Store.platePayment === Store.user.licenseplate || Store.platePayment === Store.user.spareplate} />
                                    </div>
                                </div>
                                <div className='paypal-button'>
                                    {Store.payment != 0 && Store.activeId != null && Store.payment != "NaN" && Store.platePayment != '' &&
                                        (<>
                                            <p>Cijena: {Store.payment}</p>
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
                                                                    value: Number(Store.payment)
                                                                },
                                                            }],
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order.capture().then((details) => {
                                                            alert("Uspješno plaćanje.")
                                                            Store.parkingPayment();
                                                        });
                                                    }}
                                                />
                                            </PayPalScriptProvider></>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {Store.user.id !== id &&
                <NotFound />
            }
        </>
    )
}
)

export default ParkingComponent;

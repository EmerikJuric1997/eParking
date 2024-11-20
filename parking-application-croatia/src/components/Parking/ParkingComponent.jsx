import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './ParkingComponent.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Store from '../../store/Store';
import { observer } from 'mobx-react-lite';

const ParkingComponent = observer(() => {

    const [sparePlate, setSparePlate] = useState();
    const [activePlateId, setPlateActiveId] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [price, setPrice] = useState(0);
    const [zone, setZone] = useState(0);
    const [payment, setPayment] = useState(0);
    const [time, setTime] = useState({
        hour: '', minute: ''
    });

    let { id } = useParams();

    useEffect(() => {
        Store.fetchUserById(id)
    }, [])


    const handleTime = event => {
        const { name, value } = event.target;
        setTime({ ...time, [name]: value });
    };

    const handleZone = e => {
        const value = e.target.value;
        setZone(parseInt(value));
    }

    const handlePlate = e => {
        const value = e.target.value;
        setSparePlate(value);
    }

    const handleCheckboxChange = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    const handlePlateChange = (id) => {
        setPlateActiveId(activePlateId === id ? null : id);
    };

    const checkZone = () => {
        if (activeId === null) {
            setPayment(0)
        }
    }

    useEffect(() => {
        getPayment();
        checkZone();
    }, [time, zone, price, activeId])

    const getPayment = () => {
        const sum = parseFloat((Number(time.hour) + (Number(time.minute) / 60)) * price).toFixed(2);
        if (zone === 1) {
            setPrice(0.5);
            setPayment(sum);
        }
        if (zone === 2) {
            setPrice(0.4);
            setPayment(sum);
        }
        if (zone === 3) {
            setPrice(0.3);
            setPayment(sum);
        }
        else {
            setPayment(sum);
        }
    }

    return (
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
                            <h1 className='parking-timer'>
                                1h 29min 39s
                            </h1>
                        </div>
                        <div>
                            <h1>
                                Zona: 1
                            </h1>
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
                                value={time.hour}
                                onChange={handleTime}
                            />
                            <input
                                placeholder='Unesite broj minuta'
                                className='parking-input'
                                type="number"
                                name="minute"
                                min={0}
                                value={time.minute}
                                onChange={handleTime}
                            /><p></p>
                        </div>
                        <div>
                            <p>
                                Odaberite zonu:
                            </p>
                        </div>
                        <div className='parking-zone'>
                            <div className='parking-zone-checkbox'>
                                <input type="checkbox" id="checkbox-1" name="1" value={1} onInput={handleZone} onChange={() => handleCheckboxChange(1)} disabled={activeId !== null && activeId !== 1} checked={activeId === 1} />
                                <label> Zona 1</label>
                            </div>
                            <div className='parking-zone-checkbox'>
                                <input type="checkbox" id="checkbox-2" name="2" value={2} onInput={handleZone} onChange={() => handleCheckboxChange(2)} disabled={activeId !== null && activeId !== 2} checked={activeId === 2} />
                                <label> Zona 2</label>
                            </div>
                            <div className='parking-zone-checkbox'>
                                <input type="checkbox" id="checkbox-3" name="3" value={3} onInput={handleZone} onChange={() => handleCheckboxChange(3)} disabled={activeId !== null && activeId !== 3} checked={activeId === 3} />
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
                                <input type="checkbox" id="checkbox-4" name="my-plate" value='' onChange={() => handlePlateChange(1)} disabled={activePlateId !== null && activePlateId !== 1} checked={activePlateId === 1} />
                                <label>OS345HA</label>
                            </div>
                            <div className='parking-zone-checkbox'>
                                <input className='parking-input' id="checkbox-5" name="other-plate" value={sparePlate} placeholder='Upišite drugu tablicu' onClick={() => handlePlateChange(2)} disabled={activePlateId !== null && activePlateId !== 2} />
                            </div>
                        </div>
                        <div className='paypal-button'>
                            { payment != 0 && (<><p>Cijena: {payment}</p>
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
                                                    value: Number(payment) },
                                            }],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            alert(`Transaction completed by ${details.payer.name.given_name}`);
                                        });
                                    }}
                                />
                            </PayPalScriptProvider></>) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
)

export default ParkingComponent;

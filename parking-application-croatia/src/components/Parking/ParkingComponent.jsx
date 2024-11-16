import './ParkingComponent.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function ParkingComponent() {
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
                                value="{formData.email}"
                                onChange="{handleInputChange}"
                            />
                            <input
                                placeholder='Unesite broj minuta'
                                className='parking-input'
                                type="number"
                                name="minute"
                                value="{formData.email}"
                                onChange="{handleInputChange}"
                            />
                        </div>
                        <div>
                            <h2>
                                Odaberite zonu
                            </h2>
                        </div>
                        <div className='parking-zone'>
                            <div className='parking-zone-checkbox'>
                                <input type="checkbox" id="zona1" name="zona1" value="1" />
                                <label for="vehicle1"> Zona 1</label>
                            </div>
                            <div className='parking-zone-checkbox'>
                                <input type="checkbox" id="zona2" name="zona2" value="2" />
                                <label for="vehicle1"> Zona 2</label>
                            </div>
                            <div className='parking-zone-checkbox'>
                                <input type="checkbox" id="zona3" name="zona3" value="3" />
                                <label for="vehicle1"> Zona 3</label>
                            </div>
                        </div>
                        <div className='paypal-button'>
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
                                                amount: { value: "10.00" }, // Change amount as needed
                                            }],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            alert(`Transaction completed by ${details.payer.name.given_name}`);
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

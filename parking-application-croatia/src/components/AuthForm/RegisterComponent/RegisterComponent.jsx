import './RegisterComponent.css';
import Store from '../../../store/Store';
import { observer } from 'mobx-react-lite';

const RegisterComponent = observer(() => {

    return (
        <div className='form-component-register'>
            <div className='form-background-register'>
                <div className='form-container-register'>
                    <div className='form-image'>
                        <img src="/assets/logo.png" alt="App logo" />
                        <h1>Registracija</h1>
                    </div>
                    <div className='form-input-register'>
                        {Store.errors.name && <p style={{ color: 'red' }}>{Store.errors.name}</p>}
                        <input
                            placeholder='Ime'
                            type="text"
                            name="name"
                            value={Store.name}
                            onChange={(e) => Store.setName(e.target.value)}
                        />
                    </div>
                    <div className='form-input-register'>
                        {Store.errors.surname && <p style={{ color: 'red' }}>{Store.errors.surname}</p>}
                        <input
                            placeholder='Prezime'
                            type="text"
                            name="surname"
                            value={Store.surname}
                            onChange={(e) => Store.setSurname(e.target.value)}
                        />
                    </div>
                    <div className='form-input-register'>
                        {Store.errors.email && <p style={{ color: 'red' }}>{Store.errors.email}</p>}
                        <input
                            placeholder='E-mail'
                            type="email"
                            name="email"
                            value={Store.email}
                            onChange={(e) => Store.setUsername(e.target.value)}
                        />
                    </div>
                    <div className='form-input-register'>
                        {Store.errors.password && <p style={{ color: 'red' }}>{Store.errors.password}</p>}
                        <input
                            placeholder='Lozinka'
                            type="password"
                            name="password"
                            value={Store.password}
                            onChange={(e) => Store.setPassword(e.target.value)}
                        />
                    </div>
                    <div className='form-input-register'>
                        {Store.errors.licensePlate && <p style={{ color: 'red' }}>{Store.errors.licensePlate}</p>}
                        <input
                            placeholder='Registracijska oznaka (ZG550JJ)'
                            type="text"
                            name="licensePlate"
                            value={Store.licensePlate}
                            onChange={(e) => Store.setLicensePlate(e.target.value)}
                        />
                    </div>
                    <div className='form-input-register'>
                        {Store.errors.sparePlate && <p style={{ color: 'red' }}>{Store.errors.licensePlateOptional}</p>}
                        <input
                            placeholder='Registracijska oznaka 2 - nije obavezno'
                            type="text"
                            name="licensePlate"
                            value={Store.sparePlate}
                            onChange={(e) => Store.setSparePlate(e.target.value)}
                        />
                    </div>
                    <button className='sign-button-register' onClick={() => Store.register()}>Registriraj se</button>
                </div>
            </div>
        </div>
    )
});

export default RegisterComponent;

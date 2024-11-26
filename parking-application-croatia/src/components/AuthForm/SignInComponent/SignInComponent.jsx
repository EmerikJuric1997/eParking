import './SignInComponent.css'
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Store from '../../../store/Store';
import { useNavigate } from 'react-router-dom';

const SignInComponent = observer(() => {

    const navigate = useNavigate();

    const handleLogIn = async () => {
        await Store.login(navigate);
    };

    return (
        <div className='form-component'>
            <div className='form-background'>
                <div className='form-container'>
                    <div className='form-image'>
                        <img src="/assets/logo.png" alt="App logo" />
                        <h1>Prijava</h1>
                    </div>
                    <div className='form-input'>
                        {Store.errors.email && <p style={{ color: 'red' }}>{Store.errors.email}</p>}
                        <input
                            placeholder='E-mail'
                            type="email"
                            name="email"
                            value={Store.username}
                            onChange={(e) => Store.setUsername(e.target.value)}
                        />
                    </div>
                    <div className='form-input'>
                        {Store.errors.password && <p style={{ color: 'red' }}>{Store.errors.password}</p>}
                        <input
                            placeholder='Lozinka'
                            type="password"
                            name="password"
                            value={Store.password}
                            onChange={(e) => Store.setPassword(e.target.value)}
                        />
                    </div>
                    <button className='sign-button' onClick={handleLogIn}>Prijavi se</button>
                    <p>Nemate račun? <Link to="/register" className='page-link'>Registrirajte se</Link>!</p>
                </div>
            </div>
        </div>
    )
});

export default SignInComponent;

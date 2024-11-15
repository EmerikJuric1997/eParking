import { useState } from 'react';
import './SignInComponent.css'
import { Link } from 'react-router-dom';

export default function SignInComponent() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
        
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!formData.email) {
            formErrors.email = "Email je obavezan.";
            isValid = false;
        } else if (!emailPattern.test(formData.email)) {
            formErrors.email = "Unesite valjanu E-mail adresu.";
            isValid = false;
        }

        if (!formData.password) {
            formErrors.password = "Lozinka je obavezna.";
            isValid = false;
        } else if (formData.password.length < 6) {
            formErrors.password = "Lozinka mora sadržavati minimalno 6 znamenki.";
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            alert('Form submitted successfully');
            // Proceed with form submission logic, like API call
        }
    };

    return (
        <div className='form-component'>
        <div className='form-background'>
            <form onSubmit={handleSubmit} className='form-container'>
                <div className='form-image'>
                <img src="/assets/logo.png" alt="App logo" />
                <h1>Prijava</h1>
                </div>
                <div className='form-input'>
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    <input
                    placeholder='E-mail'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-input'>
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <input
                    placeholder='Lozinka'
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <button className='sign-button' type="submit">Prijavi se</button>
                <p>Nemate račun? <Link to="/register" className='page-link'>Registrirajte se</Link>!</p>
            </form>
        </div>
        </div>
    )
}

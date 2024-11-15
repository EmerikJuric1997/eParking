import { useState } from 'react';
import './RegisterComponent.css'

export default function RegisterComponent() {

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        licensePlate: '',
        licensePlateOptional: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        licensePlate: '',
        licensePlateOptional: ''
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

        if (!formData.name) {
            formErrors.name = "Ime je obavezno.";
            isValid = false;
        }

        if (!formData.surname) {
            formErrors.surname = "Prezime je obavezno.";
            isValid = false;
        }

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

        if (!formData.licensePlate) {
            formErrors.licensePlate = "Registracijska oznaka je obavezna.";
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
        <div className='form-component-register'>
        <div className='form-background-register'>
            <form onSubmit={handleSubmit} className='form-container-register'>
                <div className='form-image'>
                <img src="/assets/logo.png" alt="App logo" />
                <h1>Registracija</h1>
                </div>
                <div className='form-input-register'>
                {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    <input
                    placeholder='Ime'
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-input-register'>
                {errors.surname && <p style={{ color: 'red' }}>{errors.surname}</p>}
                    <input
                    placeholder='Prezime'
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-input-register'>
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    <input
                    placeholder='E-mail'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-input-register'>
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <input
                    placeholder='Lozinka'
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-input-register'>
                {errors.licensePlate && <p style={{ color: 'red' }}>{errors.licensePlate}</p>}
                    <input
                    placeholder='Registracijska oznaka (ZG550JJ)'
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-input-register'>
                {errors.licensePlateOptional && <p style={{ color: 'red' }}>{errors.licensePlateOptional}</p>}
                    <input
                    placeholder='Registracijska oznaka 2 - nije obavezno'
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlateOptional}
                        onChange={handleInputChange}
                    />
                </div>
                <button className='sign-button-register' type="submit">Registriraj se</button>
            </form>
        </div>
        </div>
    )
}

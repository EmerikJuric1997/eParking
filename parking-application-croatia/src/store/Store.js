import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class Store {
    name = '';
    surname = '';
    username = '';
    password = '';
    licensePlate = '';
    sparePlate = '';
    user = null;
    isAuthenticated = false;
    token = null;
    errors = {
        name: '',
        surname: '',
        username: '',
        password: '',
        licensePlate: '',
        licensePlateOptional: ''
    };

    token = localStorage.getItem('token') || null;

    constructor() {
        makeAutoObservable(this);

        // Restore authentication state from local storage
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            this.token = savedToken;
            this.user = JSON.parse(savedUser);
            this.isAuthenticated = true;
        }

    }

    setName(value) {
        this.name = value;
    }

    setSurname(value) {
        this.surname = value;
    }

    setUsername(value) {
        this.username = value;
    }

    setPassword(value) {
        this.password = value;
    }

    setLicensePlate(value) {
        this.licensePlate = value;
    }

    setSparePlate(value) {
        this.sparePlate = value;
    }

    validateSignInForm() {
        let isValid = true;

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!this.username) {
            this.errors.email = "Email je obavezan.";
            isValid = false;
        } else if (!emailPattern.test(this.username)) {
            this.errors.email = "Unesite valjanu E-mail adresu.";
            isValid = false;
        }

        if (!this.password) {
            this.errors.password = "Lozinka je obavezna.";
            isValid = false;
        } else if (this.password.length < 6) {
            this.errors.password = "Lozinka mora sadržavati minimalno 6 znamenki.";
            isValid = false;
        }

        return isValid;
    };

    validateRegisterForm() {
        let isValid = true;

        if (!this.name) {
            this.errors.name = "Ime je obavezno.";
            isValid = false;
        }

        if (!this.surname) {
            this.errors.surname = "Prezime je obavezno.";
            isValid = false;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!this.email) {
            this.errors.email = "Email je obavezan.";
            isValid = false;
        } else if (!emailPattern.test(this.email)) {
            this.errors.email = "Unesite valjanu E-mail adresu.";
            isValid = false;
        }

        if (!this.password) {
            this.errors.password = "Lozinka je obavezna.";
            isValid = false;
        } else if (this.password.length < 6) {
            this.errors.password = "Lozinka mora sadržavati minimalno 6 znamenki.";
            isValid = false;
        }

        if (!this.licensePlate) {
            this.errors.licensePlate = "Registracijska oznaka je obavezna.";
            isValid = false;
        }

        return isValid;
    };

    async login(navigate) {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: this.username,
                password: this.password,
            });
            this.token = response.data.token;
            this.user = response.data.user;
            this.isAuthenticated = true;
            // Save token and user info in local storage
            localStorage.setItem("token", this.token);
            localStorage.setItem("user", JSON.stringify(this.user));
            if (navigate) {
                navigate("/parking/:id");
            }
        } catch (error) {
            this.validateSignInForm();
            alert(error);
        }
    }

    async register() {
        try {
            await axios.post('http://localhost:5000/register', {
                name: this.name,
                surname: this.surname,
                username: this.username,
                password: this.password,
                licenseplate: this.licensePlate.toUpperCase(),
                spareplate: this.sparePlate.toUpperCase(),
            });
        } catch (error) {
            this.validateRegisterForm();
            console.error('Registration failed:', error);
        }
    }

    async fetchProtectedData() {
        try {
            const response = await axios.get("http://localhost:5000/user", {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            console.log("Protected data:", response.data);
        } catch (error) {
            console.error("Failed to fetch protected data:", error);
        }
    }

    async logout(navigate) {
        this.isAuthenticated = false;
        this.user = null;
        this.token = null;

        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (navigate) navigate("/login");
    }
}

export default new Store();

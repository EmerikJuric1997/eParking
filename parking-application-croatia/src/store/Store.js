import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { runInAction } from 'mobx';

class Store {
    name = '';
    surname = '';
    username = '';
    password = '';
    licensePlate = '';
    sparePlate = '';
    imageFile = null;
    profileImage = "";
    profileImagePreview = null; // Preview URL
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

    setProfileImage(image) {
        this.profileImage = image; // Store file for preview
    }

    setProfileImagePreview(preview) {
        this.profileImagePreview = preview; // Save the preview URL
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
                navigate(`/parking/${this.user.id}`);
            }
        } catch (error) {
            this.validateSignInForm();
            alert("Pogriješili ste E-mail ili lozinku", error);
            errors = {
                name: '',
                surname: '',
                username: '',
                password: '',
                licensePlate: '',
                licensePlateOptional: ''
            };
        }
    }

    async register(navigate) {
        try {
            await axios.post('http://localhost:5000/register', {
                name: this.name,
                surname: this.surname,
                username: this.username,
                password: this.password,
                licenseplate: this.licensePlate.toUpperCase(),
                spareplate: this.sparePlate.toUpperCase(),
                profileimage: "/uploads/1.jpg"
            });
            await this.login();
            if (navigate) {
                navigate(`/parking/${this.user.id}`);
            }
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
        this.name = '';
        this.surname = '';
        this.username = '';
        this.password = '';
        this.licensePlate = '';
        this.sparePlate = '';

        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (navigate) navigate("/login");
    }

    async fetchUserById(id) {
        try {
            const response = await axios.get(`http://localhost:5000/user/${id}`);
            runInAction(() => {
                this.user = response.data; // Store user data in MobX
                this.name = this.user.name;
                this.username = this.user.username;
                this.user.profileimage = this.user.profileimage.replace(/^data:image\/\w+;base64,/, "");
            });
            this.licensePlate = this.user.licenseplate.toUpperCase();
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }

    async fetchProfileImage() {
        if(this.user) {
            try {
                const response = await axios.get(`http://localhost:5000/user/${this.user.id}`);
                runInAction(() => {
                    this.user = response.data; // Store user data in MobX
                    console.log(this.user.profileimage)
                    this.user.profileiimage = this.user.profileimage.replace(/^data:image\/\w+;base64,/, "");
                });
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }
    }

    async updateUser(id) {
        try {
            const response = await axios.put(`http://localhost:5000/user/${id}`, {
                name: this.name,
                username: this.username,
                licenseplate: this.licensePlate.toUpperCase(),
            });
            if (this.profileImage) {
                await this.uploadProfileImage(id)
            }
            await this.fetchUserById(id)
        } catch (error) {
            console.error("Failed to update user:", error);
            throw error;
        }
    }

    async uploadProfileImage(userId) {
        if (!this.profileImage) {
            console.error("No image selected for upload.");
            return;
        }

        const formData = new FormData();
        formData.append("profileimage", this.profileImage);

        try {
            const response = await axios.put(`http://localhost:5000/user/${userId}/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            runInAction(() => {
                if (this.user) this.user.profileimage = response.data.imagePath; // Update local user image
                this.profileImage = null; // Clear file reference
            });
        } catch (error) {
            console.error("Failed to upload profile image:", error);
        }
    }


    // Set profile image for upload
    setProfileImage(file) {
        this.profileImage = file;
    }
}

export default new Store();

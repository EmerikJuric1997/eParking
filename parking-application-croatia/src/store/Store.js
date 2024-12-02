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
    profileImagePreview = null;
    user = null;
    isAuthenticated = false;
    token = null;
    payment = 0;
    sparePlateInput = '';
    payedFines = null;
    activePlateId = '';
    activeId = null;
    platePayment = '';
    userReceipts = [];
    userFines = [];
    expireDate = null;
    lastReceipt = null;
    currentDate = new Date().toISOString();
    timerHour = 0;
    timerMinute = null;
    timerSecond = null;
    timerHourDb = null;
    timerMinuteDb = null;
    timerSecondDb = null;
    zoneReceipt = null;
    cameraCheckPlate = null;
    paidReceipt = null;
    licensePlateSeach = '';
    totalIncome = null;
    price = 0;
    zone = 0;
    hour = '';
    minute = '';
    hourCount = null;
    minuteCount = null;
    secondCount = null;
    totalSeconds = null;
    allUsers = null;
    allReceipts = null;
    checkedReceipt = null;
    errors = {
        name: '',
        surname: '',
        username: '',
        password: '',
        licensePlate: '',
        licensePlateOptional: ''
    };

    token = localStorage.getItem('token') || null;

    //Constructor to make everything observable and for storing JWT and current user
    constructor() {
        makeAutoObservable(this);

        // Restore authentication state from local storage
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            runInAction(() => {
                this.token = savedToken;
                this.user = JSON.parse(savedUser);
                this.isAuthenticated = true;
            })
        }

    }

    //Function for setting zone, price and sum of the price
    getPayment = () => {
        runInAction(() => {
            const sum = parseFloat(((Number(this.hour) + Number(this.minute) / 60)) * this.price).toFixed(2);
            if (this.zone === 1) {
                this.price = 0.5;
                this.payment = Number(sum);
            }
            if (this.zone === 2) {
                this.price = 0.4;
                this.payment = Number(sum);
            }
            if (this.zone === 3) {
                this.price = 0.3;
                this.payment = Number(sum);
            }
            else {
                this.payment = sum;
            }
        })
    }

    //Setting the name value
    setName(value) {
        runInAction(() => {
            this.name = value;
        })
    }

    //Setting the surname value
    setSurname(value) {
        runInAction(() => {
            this.surname = value;
        })
    }

    //Setting the username(email) value
    setUsername(value) {
        runInAction(() => {
            this.username = value;
        })
    }

    //Setting the password value
    setPassword(value) {
        runInAction(() => {
            this.password = value;
        })
    }

    //Setting the license plate value
    setLicensePlate(value) {
        runInAction(() => {
            this.licensePlate = value;
        })
    }

    //Seting the spare plate value
    setSparePlate(value) {
        runInAction(() => {
            this.sparePlate = value;
        })
    }

    //Setting the profile image
    setProfileImage(image) {
        runInAction(() => {
            this.profileImage = image;
        })
    }

    //Setting the profile image preview(image picked and showed from local storage)
    setProfileImagePreview(preview) {
        runInAction(() => {
            this.profileImagePreview = preview;
        })
    }

    //Setting the profile image file that will be uploaded to the database
    setProfileImage(file) {
        runInAction(() => {
            this.profileImage = file;
        })
    }

    //Function for validating the sign in form
    validateSignInForm() {
        runInAction(() => {
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
        })
    };

    //Function for validating the register form
    validateRegisterForm() {
        runInAction(() => {
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
        })
    };

    //Function to log in the user 
    async login(navigate) {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: this.username,
                password: this.password,
            });
            runInAction(() => {
                this.token = response.data.token;
                this.user = response.data.user;
                this.isAuthenticated = true;
                localStorage.setItem("token", this.token);
                localStorage.setItem("user", JSON.stringify(this.user));
                if (navigate) {
                    navigate(`/parking/${this.user.id}`);
                }
                this.errors = {
                    name: '',
                    surname: '',
                    username: '',
                    password: '',
                    licensePlate: '',
                    licensePlateOptional: ''
                };
            })
        } catch (error) {
            runInAction(() => {
                this.validateSignInForm();
                alert("Pogriješili ste E-mail ili lozinku", error);
            })
        }
    }

    //Function to register the user
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
            runInAction(() => {
                this.errors = {
                    name: '',
                    surname: '',
                    username: '',
                    password: '',
                    licensePlate: '',
                    licensePlateOptional: ''
                };
                if (navigate) {
                    navigate(`/parking/${this.user.id}`);
                }
            })
        } catch (error) {
            runInAction(() => {
                this.validateRegisterForm();
                alert("Pogriješili ste u unosu podataka.");
            })
        }
    }

    //Function to get the protected data - JWT 
    async fetchProtectedData() {
        try {
            const response = await axios.get("http://localhost:5000/user", {
                headers: { Authorization: `Bearer ${this.token}` },
            });
        } catch (error) {
            console.error("Failed to fetch protected data:", error);
        }
    }

    //Function to log out the user
    async logout(navigate) {
        runInAction(() => {
            this.isAuthenticated = false;
            localStorage.removeItem("token", this.token);
            localStorage.removeItem("user", JSON.stringify(this.user));
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
        })
    }

    //Function for getting the user by id
    async fetchUserById(id) {
        try {
            const response = await axios.get(`http://localhost:5000/user/${id}`);
            runInAction(() => {
                this.user = response.data;
                this.name = this.user.name;
                this.username = this.user.username;
                this.user.profileimage = this.user.profileimage.replace(/^data:image\/\w+;base64,/, "");
                this.licensePlate = this.user.licenseplate.toUpperCase();
                localStorage.removeItem("user");
                localStorage.setItem("user", JSON.stringify(this.user));
            });
        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("user");
        }
    }

    //Function to get all of the users
    async fetchAllUsers() {
        try {
            const response = await axios.get(`http://localhost:5000/users`);
            runInAction(() => {
                this.allUsers = response.data.user;
            });
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }

    //Function to get all of the receipts
    async fetchAllReceipts() {
        try {
            const response = await axios.get(`http://localhost:5000/receipts`);
            runInAction(() => {
                this.allReceipts = response.data.receipts;
            });
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }

    //Function to get all of the users with the specific license plate
    async fetchAllUsersByPlate() {
        try {
            const response = await axios.get('http://localhost:5000/userplates', {
                params: {
                    licensePlate: this.licensePlateSeach,
                    sparePlate: this.licensePlateSeach,
                },
            });
            runInAction(() => {
                this.allUsers = response.data.user;
            });
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }

    //Function to get all fines that are payed
    async fetchPayedFines() {
        try {
            const response = await axios.get(`http://localhost:5000/user/${this.user.id}`);
            runInAction(() => {
                this.payedFines = response.data;
            });
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }

    //Function to get the total income of ll of the receipts
    async getTotalIncome() {
        try {
            const response = await axios.get('http://localhost:5000/totalincome');
            runInAction(() => {
                this.totalIncome = response.data.total[0].total_price;
            });
        } catch (error) {
            console.error("Failed to fetch income:", error);
        }
    }

    //Function to update specific user name, username(email) and license plate
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

    //Function to update the spare plate of the specific user
    async updateSparePlate(sparePlate) {
        try {
            const response = await axios.put(`http://localhost:5000/updateuser/${this.user.id}`, {
                sparePlate: sparePlate.toUpperCase(),
            });
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    }

    //Function to upload the selected image to users profile image
    async uploadProfileImage(userId) {
        if (!this.profileImage) {
            runInAction(() => {
                console.error("No image selected for upload.");
                return;
            })
        }
        const formData = new FormData();
        runInAction(() => {
            formData.append("profileimage", this.profileImage);
        })
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

    //Function for parking payment
    parkingPayment = async () => {
        try {
            const cuurentDate = new Date();
            const year = cuurentDate.getFullYear();
            const month = String(cuurentDate.getMonth() + 1).padStart(2, '0');
            const day = String(cuurentDate.getDate()).padStart(2, '0');
            const hours = String(cuurentDate.getHours()).padStart(2, '0');
            const minutes = String(cuurentDate.getMinutes()).padStart(2, '0');
            const seconds = String(cuurentDate.getSeconds()).padStart(2, '0');
            const date = new Date();
            date.setHours(date.getHours() + (this.hour));
            date.setMinutes(date.getMinutes() + this.minute);
            const dateAdd = new Date();
            dateAdd.setHours(dateAdd.getHours() + (Number(this.hour) + Number(this.timerHour)));
            dateAdd.setMinutes(dateAdd.getMinutes() + (Number(this.minute) + Number(this.timerMinute)));
            const formattedCurrentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            const formattedDateAdd = `${dateAdd.getFullYear()}-${String(dateAdd.getMonth() + 1).padStart(2, '0')}-${String(dateAdd.getDate()).padStart(2, '0')} ${String(dateAdd.getHours()).padStart(2, '0')}:${String(dateAdd.getMinutes()).padStart(2, '0')}:${String(dateAdd.getSeconds()).padStart(2, '0')}`;
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            this.updateSparePlate(this.platePayment);
            this.postAdminReceipts(formattedCurrentDate, formattedDate);
            if (this.lastReceipt) {
                const dateExpireDb = new Date(this.lastReceipt.expire_date);
                const dateNow = new Date();
                if (dateExpireDb > dateNow && this.lastReceipt.zone === this.zone && this.lastReceipt.license_plate === this.platePayment) {
                    await axios.post('http://localhost:5000/pay', {
                        receiptDate: formattedCurrentDate,
                        expireDate: formattedDateAdd,
                        price: this.payment,
                        userId: this.user.id,
                        licensePlate: this.platePayment.toUpperCase(),
                        zone: this.zone
                    });
                }
                else {
                    await axios.post('http://localhost:5000/pay', {
                        receiptDate: formattedCurrentDate,
                        expireDate: formattedDate,
                        price: this.payment,
                        userId: this.user.id,
                        licensePlate: this.platePayment.toUpperCase(),
                        zone: this.zone
                    });
                }
            }
            else {
                await axios.post('http://localhost:5000/pay', {
                    receiptDate: formattedCurrentDate,
                    expireDate: formattedDate,
                    price: this.payment,
                    userId: this.user.id,
                    licensePlate: this.platePayment.toUpperCase(),
                    zone: this.zone
                });
            }
            runInAction(() => {
                this.totalSeconds = 0;
                this.fetchLastReceipt();
            })
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //Function for fine payment
    finePayment = async (price, plate, zone) => {
        try {
            runInAction(() => {
                const cuurentDate = new Date();
                const year = cuurentDate.getFullYear();
                const month = String(cuurentDate.getMonth() + 1).padStart(2, '0');
                const day = String(cuurentDate.getDate()).padStart(2, '0');
                const hours = String(cuurentDate.getHours()).padStart(2, '0');
                const minutes = String(cuurentDate.getMinutes()).padStart(2, '0');
                const seconds = String(cuurentDate.getSeconds()).padStart(2, '0');
                const date = new Date();
                date.setHours(date.getHours() + (this.hour));
                date.setMinutes(date.getMinutes() + this.minute);
                const dateAdd = new Date();
                dateAdd.setHours(dateAdd.getHours() + 24);
                dateAdd.setMinutes(dateAdd.getMinutes());
                const formattedCurrentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                const formattedDateAdd = `${dateAdd.getFullYear()}-${String(dateAdd.getMonth() + 1).padStart(2, '0')}-${String(dateAdd.getDate()).padStart(2, '0')} ${String(dateAdd.getHours()).padStart(2, '0')}:${String(dateAdd.getMinutes()).padStart(2, '0')}:${String(dateAdd.getSeconds()).padStart(2, '0')}`;
                this.postAdminReceipts(formattedCurrentDate, formattedDateAdd);
            })
            await axios.post('http://localhost:5000/payfine', {
                receiptDate: formattedCurrentDate,
                expireDate: formattedDateAdd,
                price: price,
                userId: this.user.id,
                licensePlate: plate.toUpperCase(),
                zone: zone
            });
            await axios.post('http://localhost:5000/allreceipts', {
                receiptDate: formattedCurrentDate,
                expireDate: formattedDateAdd,
                price: price,
                userId: this.user.id,
                licensePlate: plate.toUpperCase(),
                zone: zone
            });
            runInAction(() => {
                this.totalSeconds = 0;
                this.fetchLastReceipt();
                this.fetchUserReceipt();
            })
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //Function for storing the receipt in the admin receipt table
    async postAdminReceipts(currDate, formatDate) {
        try {
            await axios.post('http://localhost:5000/allreceipts', {
                receiptDate: currDate,
                expireDate: formatDate,
                price: this.payment,
                userId: this.user.id,
                licensePlate: this.platePayment.toUpperCase(),
                zone: this.zone
            });
        }
        catch (error) {
            console.log(error)
        }
    };

    //Function for getting all the receipts from a specific user
    async fetchUserReceipt() {
        if (this.user) {
            try {
                const response = await axios.get(`http://localhost:5000/user/${this.user.id}/receipt`);
                runInAction(() => {
                    this.userReceipts = response.data.receipts
                    this.fetchLastReceipt();
                });
            } catch (error) {
                console.error("Failed to fetch receipt:", error);
            }
        }
    }

    //Function for getting all the fines from a specific user
    async fetchUserFine() {
        if (this.user) {
            try {
                const response = await axios.get(`http://localhost:5000/fines/${this.user.id}`);
                runInAction(() => {
                    this.userFines = response.data.fines;
                });
            } catch (error) {
                console.log("Failed to fetch fines:", error.response?.data || error.message);
            }
        }
    }

    //Function for getting the last receipt that is valid
    async fetchLastReceipt() {
        if (this.user) {
            try {
                const response = await axios.get(`http://localhost:5000/receipt/${this.user.id}`);
                runInAction(() => {
                    this.lastReceipt = response.data.receipts[0];
                    if (this.lastReceipt) {
                        runInAction(() => {
                            const currentDate = new Date();
                            const expiryDate = new Date(String(this.lastReceipt.expire_date));
                            const currentTimeInMinutes = currentDate.getTime() / (1000 * 60);
                            const expiryTimeInMinutes = expiryDate.getTime() / (1000 * 60);
                            const timeDifferenceInMinutes = Math.max(0, expiryTimeInMinutes - currentTimeInMinutes);
                            const currentTimeInSeconds = Math.floor(currentDate.getTime() / 1000);
                            const expiryTimeInSeconds = Math.floor(expiryDate.getTime() / 1000);
                            const timeDifferenceInSeconds = Math.max(0, expiryTimeInSeconds - currentTimeInSeconds);
                            this.timerHourDb = Math.floor(timeDifferenceInMinutes / 60);
                            this.timerMinuteDb = Math.floor(timeDifferenceInMinutes % 60);
                            this.timerSecondDb = Math.floor(timeDifferenceInSeconds % 60);
                        })
                        if (this.timerHourDb <= 0 && this.timerMinuteDb <= 0 && this.timerSecondDb <= 0) {
                            runInAction(() => {
                                this.timerHour = 0;
                                this.timerMinute = 0;
                                this.timerSecond = 0;
                                this.zoneReceipt = 0;
                                this.payment = 0;
                                this.totalSeconds = 0;
                                this.sparePlateInput = '';
                                this.activePlateId = '';
                                this.activeId = null;
                                this.platePayment = '';
                                this.price = 0;
                                this.zone = 0;
                                this.hour = '';
                                this.minute = '';
                                this.totalSeconds = 0;
                            })
                        }
                        else {
                            runInAction(() => {
                                this.timerHour = this.timerHourDb;
                                this.timerMinute = this.timerMinuteDb;
                                this.timerSecond = this.timerSecondDb;
                                this.zoneReceipt = this.lastReceipt.zone;
                                this.payment = 0;
                                this.sparePlateInput = '';
                                this.activePlateId = '';
                                this.activeId = this.lastReceipt.zone;
                                this.platePayment = this.lastReceipt.license_plate;
                                this.price = 0;
                                this.zone = this.lastReceipt.zone;
                                this.hour = '';
                                this.minute = '';
                            })
                        }
                        runInAction(() => {
                            this.countdownTimer(this.lastReceipt.id);
                        })
                    }
                    else {
                        runInAction(() => {
                            this.timerHour = 0;
                            this.timerMinute = 0;
                            this.timerSecond = 0;
                            this.zoneReceipt = 0;
                            this.payment = 0;
                            this.totalSeconds = 0;
                            this.sparePlateInput = '';
                            this.activePlateId = '';
                            this.activeId = null;
                            this.platePayment = '';
                            this.price = 0;
                            this.zone = 0;
                            this.hour = '';
                            this.minute = '';
                            this.totalSeconds = 0;
                        })
                    }
                });
            } catch (error) {
                console.error("Failed to fetch last receipt:", error);
            }
        }
    }

    //Function for deleting specific receipt
    async deleteReceipt(id) {
        try {
            const response = await axios.delete(`http://localhost:5000/receipt/${id}`);
            runInAction(() => {
                this.fetchUserReceipt();
                this.totalSeconds = 0;
            });
        } catch (error) {
            console.error("Failed to delete receipt:", error);
        }
    }

    //Function for deleting specific user
    async deleteUser(id) {
        try {
            const response = await axios.delete(`http://localhost:5000/user/${id}`);
            runInAction(() => {
                this.fetchAllUsers();
            });
        } catch (error) {
            console.error("Failed to delete receipt:", error);
        }
    }

    //Function for deleting specific fine
    async deleteFine(id) {
        try {
            const response = await axios.delete(`http://localhost:5000/fine/${id}`);
            runInAction(() => {
                this.fetchUserFine();
            });
        } catch (error) {
            console.error("Failed to delete receipt:", error);
        }
    }

    //Function to update the expiration of specific receipt
    async updateReceipt(id) {
        try {
            const response = await axios.put(`http://localhost:5000/receipt/${id}`);
        }
        catch (err) {
            console.log(err)
        }
    }

    //Function ro update the fine when the fine is payed
    async updateFine(id) {
        try {
            const response = await axios.put(`http://localhost:5000/fine/${id}`);
        }
        catch (err) {
            console.log(err)
        }
    }

    //Function for the timer that is showing parking time remaining in real time
    countdownTimer(id) {
        const hour = this.timerHour || 0;
        const minute = this.timerMinute || 0;
        const second = this.timerSecond || 0;

        this.totalSeconds = hour * 3600 + minute * 60 + second;

        if (this.timerHour === 0 && this.timerMinute === 0 && this.timerSecond === 0) {
            runInAction(() => {
                this.hourCount = 0;
                this.minuteCount = 0;
                this.secondCount = 0;
                this.updateReceipt(id);
            });
            return;
        }

        // Clear existing interval before starting a new one
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        runInAction(() => {
            this.hourCount = Math.floor(this.totalSeconds / 3600);
            this.minuteCount = Math.floor((this.totalSeconds % 3600) / 60);
            this.secondCount = this.totalSeconds % 60;
        });

        this.timerInterval = setInterval(() => {
            if (this.timerHour === 0 && this.timerMinute === 0 && this.timerSecond === 0) {
                clearInterval(this.timerInterval);
                runInAction(() => {
                    this.hourCount = 0;
                    this.minuteCount = 0;
                    this.secondCount = 0;

                });
                return;
            }
            runInAction(() => {
                this.totalSeconds--;
            });
            const newHours = Math.floor(this.totalSeconds / 3600);
            const newMinutes = Math.floor((this.totalSeconds % 3600) / 60);
            const newSeconds = this.totalSeconds % 60;

            // Prevent unnecessary updates
            if (
                this.hourCount !== newHours ||
                this.minuteCount !== newMinutes ||
                this.secondCount !== newSeconds
            ) {
                runInAction(() => {
                    this.hourCount = newHours;
                    this.minuteCount = newMinutes;
                    this.secondCount = newSeconds;
                });
            }
        }, 1000);
    }

    //Function to check is the camera plate exist
    async checkReceipt(cameraCheckPlate) {
        try {
            const response = await axios.get('http://localhost:5000/checkreceipt', {
                params: {
                    licensePlate: cameraCheckPlate
                },
            });
            runInAction(() => {
                this.checkedReceipt = response.data.receipt;
            });
        } catch (error) {
            console.log("tablica ne postoji", error)
        }
    }

    //Function to check is the camera plate is payed
    async validatePlate(cameraCheckPlate, zone) {
        try {
            const response = await axios.get('http://localhost:5000/validatepayment', {
                params: {
                    licensePlate: cameraCheckPlate,
                    zone: zone,
                },
            });
            this.paidReceipt = response.data.receipt;
        }
        catch (error) {
            this.paidReceipt = null;
        }
    }

    //Function to check is the fine payed, if not write a payment 
    async validateParkingPayment(cameraCheckPlate, zone) {
        try {
            await this.checkReceipt(cameraCheckPlate);
            
            if (this.checkedReceipt !== null) {
                await this.validatePlate(cameraCheckPlate, zone);
                
                if (this.paidReceipt !== null) {
                    alert("Karta je plaćena.", this.paidReceipt);
                } else {
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const day = String(currentDate.getDate()).padStart(2, '0');
                    const hours = String(currentDate.getHours()).padStart(2, '0');
                    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
                    
                    const dateAdd = new Date();
                    dateAdd.setHours(dateAdd.getHours() + 24);
                    
                    const formattedCurrentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                    const formattedDateAdd = `${dateAdd.getFullYear()}-${String(dateAdd.getMonth() + 1).padStart(2, '0')}-${String(dateAdd.getDate()).padStart(2, '0')} ${String(dateAdd.getHours()).padStart(2, '0')}:${String(dateAdd.getMinutes()).padStart(2, '0')}:${String(dateAdd.getSeconds()).padStart(2, '0')}`;
                    
                    await axios.post('http://localhost:5000/fine', {
                        fineDate: formattedCurrentDate,
                        price: 10,
                        licensePlate: cameraCheckPlate,
                        zone: zone,
                    });
                    
                    await axios.post('http://localhost:5000/pay', {
                        receiptDate: formattedCurrentDate,
                        expireDate: formattedDateAdd,
                        price: 0,
                        userId: this.checkedReceipt.user_id,
                        licensePlate: cameraCheckPlate.toUpperCase(),
                        zone: zone,
                    });
                    
                    await axios.post('http://localhost:5000/allreceipts', {
                        receiptDate: formattedCurrentDate,
                        expireDate: formattedDateAdd,
                        price: 0,
                        userId: this.checkedReceipt.user_id,
                        licensePlate: cameraCheckPlate.toUpperCase(),
                        zone: zone,
                    });
                    
                    alert("Kazna naplaćena.");
                }
            }
        } catch (error) {
            console.log("Tablica ne postoji.", error);
        }
    }
    
}

export default new Store();

import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";
import path from "path";

const app = express();
const SECRET = 'your_jwt_secret';
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parkingdb',
});

app.use(cors());
app.use(bodyParser.json());

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

//Register route
app.post('/register', async (req, res) => {
    const { id, role, name, surname, username, password, licenseplate, spareplate, profileimage } = req.body;

    if (!name || !surname || !username || !password || !licenseplate) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const uId = uuidv4();
        const userRole = 'user'

        db.query(
            'INSERT INTO user (id, role, name, surname, username, password, licenseplate, spareplate, profileimage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uId, userRole, name, surname, username, hash, licenseplate, spareplate || null, profileimage || null],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Error registering user' });
                }

                const token = jwt.sign({ id: uId, username }, SECRET, { expiresIn: "1d" });

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                });

                res.status(200).json({ message: 'User registered successfully', userId: uId });
            }
        );
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM user WHERE username = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = { id: results[0].id, name: results[0].name, surname: results[0].surname, username: results[0].username, licenseplate: results[0].licenseplate };
        const token = jwt.sign(user, SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, user });
    });
});

//Authenticate JSON web token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
};

// Protected route
app.get("/user", authenticateJWT, (req, res) => {
    res.status(200).json({ user: req.user });
});

//Route for getting the user for the whole application
app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    db.query("SELECT * FROM user WHERE id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];

        res.status(200).json({
            id: user.id,
            role: user.role,
            name: user.name,
            surname: user.surname,
            username: user.username,
            licenseplate: user.licenseplate,
            spareplate: user.spareplate,
            profileimage: user.profileimage,
        });
    });
});

//Route for getting all of the users - used in admin page
app.get("/users", (req, res) => {
    db.query("SELECT * FROM user", (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "There are no users in the database." });
        }

        const user = results;

        res.status(200).json({ user });
    });
});

//Route for getting all of the receipts - used in admin page
app.get("/receipts", (req, res) => {
    db.query("SELECT * FROM receipt", (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "There are no receipts in the database." });
        }

        const receipts = results;

        res.status(200).json({ receipts });
    });
});

//Route for getting the total income of all receipts
app.get("/totalincome", (req, res) => {
    db.query("SELECT SUM(price) AS total_price FROM adminreceipt;", (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "There are no receipts in the database." });
        }

        const total = results;

        res.status(200).json({ total });
    });
});

//Route for getting all users with the specific license plate
app.get("/userplates", (req, res) => {
    const { licensePlate } = req.query;
    db.query("SELECT * FROM user WHERE licenseplate = ?", [licensePlate], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results;

        res.status(200).json({ user });
    });
});

//Route to update specific user name, email, and licenseplate
app.put("/user/:id", (req, res) => {
    const userId = req.params.id;
    const { name, username, licenseplate } = req.body;

    db.query(
        "UPDATE user SET name = ?, username = ?, licenseplate = ? WHERE id = ?",
        [name, username, licenseplate, userId],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User name, email and license plate updated successfully" });
        }
    );
});

//Route to update specific user spare license plate
app.put("/updateuser/:id", (req, res) => {
    const userId = req.params.id;
    const { sparePlate } = req.body;

    db.query(
        "UPDATE user SET spareplate = ? WHERE id = ?",
        [sparePlate, userId],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User spare license plate updated successfully" });
        }
    );
});

//Route to update user profile image
app.put("/user/:id/image", upload.single("profileimage"), (req, res) => {
    const userId = req.params.id;
    const imagePath = `/uploads/${req.file.filename}`; // Save relative path

    db.query(
        "UPDATE user SET profileimage = ? WHERE id = ?",
        [imagePath, userId],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "Profile image updated successfully", imagePath });
        }
    );
});

//Route for payment
app.post('/pay', async (req, res) => {
    const { receiptDate, expireDate, price, userId, licensePlate, zone } = req.body;
    try {
        const uId = uuidv4();
        db.query(
            'INSERT INTO receipt (id, receipt_date, expire_date, price, user_id, license_plate, zone, expired) VALUES (?, ?, ?, ?, ?, ?, ?, false)',
            [uId, receiptDate, expireDate, price, userId, licensePlate, zone],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Error payment' });
                }

                res.status(200).json({ message: 'Paid successfully.' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

//Route to store all receipts in the database
app.post('/allreceipts', async (req, res) => {
    const { receiptDate, expireDate, price, userId, licensePlate, zone } = req.body;
    try {
        const uId = uuidv4();
        db.query(
            'INSERT INTO adminreceipt (id, receipt_date, expire_date, price, user_id, license_plate, zone, expired) VALUES (?, ?, ?, ?, ?, ?, ?, false)',
            [uId, receiptDate, expireDate, price, userId, licensePlate, zone],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Error payment' });
                }
                res.status(200).json({ message: 'Paid successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

//Route for getting all receipts from specific user
app.get("/user/:id/receipt", (req, res) => {
    const userId = req.params.id;

    db.query(
        "SELECT * FROM receipt WHERE user_id = ? ORDER BY receipt_date DESC;", [userId],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Receipts not found" });
            }
            const receipts = results;

            res.status(200).json({ message: "Receipt read successfully", receipts });
        }
    );
});

//Route for deleting specific receipt
app.delete("/receipt/:id", (req, res) => {
    const { id } = req.params;
    db.query(
        "DELETE FROM receipt WHERE id = ?;", [id],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Receipt not found" });
            }

            res.status(200).json({ message: "Receipt deleted successfully" });
        }
    );
});

//Route for getting the last receipt that is still valid
app.get("/receipt/:id", (req, res) => {
    const userId = req.params.id;

    db.query(
        "SELECT * FROM receipt WHERE user_id = ? AND expired = false ORDER BY receipt_date DESC LIMIT 1;", [userId],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Receipt not found" });
            }
            const receipts = results;

            res.status(200).json({ message: "Receipt read successfully", receipts });
        }
    );
});

//Route to update the expiration for a specific receipt
app.put("/receipt/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE receipt SET expired = true WHERE id = ?;", [id],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Receipt not found" });
            }

            res.status(200).json({ message: "Receipt updated successfully" });
        }
    );
});

//Route for checking if the last receipt is still valid
app.get("/validatepayment", (req, res) => {
    const { licensePlate, zone } = req.query;

    db.query(
        "SELECT * FROM receipt WHERE license_plate = ? AND expire_date > CURRENT_TIMESTAMP AND zone = ? LIMIT 1;",
        [licensePlate, zone],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Receipt not found" });
            }

            const receipt = results[0];
            res.status(200).json({ message: "Receipt read successfully", receipt });
        }
    );
});

//Route for posting fine in the database 
app.post("/fine", (req, res) => {
    const { fineDate, price, licensePlate, zone } = req.body;
    const paid = false;
    const uId = uuidv4();
    db.query(
        "INSERT INTO fine (id, fine_date, price, license_plate, zone, paid) VALUES (?, ?, ?, ?, ?, ?)",
        [uId, fineDate, price, licensePlate, zone, paid],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Fine not found" });
            }

            res.status(200).json({ message: "Fines posted successfully" });
        }
    );
});

//Route for getting all the fines for a specific user
app.get("/fines/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT DISTINCT fine.* FROM fine LEFT JOIN user ON fine.license_plate = user.licenseplate OR fine.license_plate = user.spareplate LEFT JOIN adminreceipt ON fine.license_plate = adminreceipt.license_plate WHERE (user.id = ? OR adminreceipt.license_plate IS NOT NULL);",
        [id],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }
            if (results.length === 0) { // Check if results array is empty
                return res.status(404).json({ message: "Fines not found" });
            }
            const fines = results;

            res.status(200).json({ message: "Fines retrieved successfully", fines });
        }
    );
});

//Route for getting all fines that are paid - so that users can delete their receipts
app.get("/finespayed/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT DISTINCT fine.* FROM fine INNER JOIN receipt ON fine.license_plate = receipt.license_plate WHERE receipt.user_id = ? AND fine.paid = true;",
        [id],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Fines not found" });
            }
            const fines = results;

            res.status(200).json({ message: "Fines retrieved successfully", fines });
        }
    );
});

//Route for deleting specific fine
app.delete("/fine/:id", (req, res) => {
    const { id } = req.params;
    db.query(
        "DELETE FROM fine WHERE id = ?;", [id],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Fine not found" });
            }

            res.status(200).json({ message: "Fine deleted successfully" });
        }
    );
});

//Route for deleting specific user - used in admin page
app.delete("/user/:id", (req, res) => {
    const { id } = req.params;
    db.query(
        "DELETE FROM user WHERE id = ?;", [id],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User deleted successfully" });
        }
    );
});

//Route for updateing/paying) specific fine 
app.put("/fine/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE fine SET paid = true WHERE id = ?;", [id],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Fine not found" });
            }

            res.status(200).json({ message: "Fine paid successfully" });
        }
    );
});

//Route for storing receipt for specific user after the fine payment
app.post('/payfine', async (req, res) => {
    const { receiptDate, expireDate, price, userId, licensePlate, zone } = req.body;
    try {
        const uId = uuidv4();
        db.query(
            'INSERT INTO receipt (id, receipt_date, expire_date, price, user_id, license_plate, zone, expired) VALUES (?, ?, ?, ?, ?, ?, ?, false)',
            [uId, receiptDate, expireDate, price, userId, licensePlate, zone],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Error payment' });
                }
                res.status(200).json({ message: 'Paid successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));

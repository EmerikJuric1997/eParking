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
const SECRET = 'your_jwt_secret'; // Replace with a secure secret
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

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure the uploads folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Registration endpoint
app.post('/register', async (req, res) => {
    const { id, name, surname, username, password, licenseplate, spareplate, profileimage } = req.body;

    // Validate that required fields are provided
    if (!name || !surname || !username || !password || !licenseplate) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const hash = await bcrypt.hash(password, 10); // Hash the password
        const uId = uuidv4(); // Generate unique ID for the user

        // Insert the user into the database
        db.query(
            'INSERT INTO users (id, name, surname, username, password, licenseplate, spareplate, profileimage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [uId, name, surname, username, hash, licenseplate, spareplate || null, profileimage || null],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Error registering user' });
                }

                // Generate a JWT token with the inserted user's ID and username
                const token = jwt.sign({ id: uId, username }, SECRET, { expiresIn: "1d" });

                // Set the JWT as a cookie
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                });

                // Return success response
                res.status(200).json({ message: 'User registered successfully', userId: uId });
            }
        );
    } catch (error) {
        console.error('Error hashing password:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});


// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = { id: results[0].id, name: results[0].name, surname: results[0].surname, username: results[0].username, licenseplate: results[0].licenseplate };
        const token = jwt.sign(user, SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, user });
    });
});

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
        req.user = user; // Attach user info to the request
        next();
    });
};

// Example protected route
app.get("/user", authenticateJWT, (req, res) => {
    res.status(200).json({ user: req.user });
});

app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];


            // Respond with user details and Base64 image
            res.status(200).json({
                id: user.id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                licenseplate: user.licenseplate,
                spareplate: user.spareplate,
                profileimage: user.profileimage,
            });
    });
});

app.put("/user/:id", (req, res) => {
    const userId = req.params.id;
    const { name, username, licenseplate } = req.body;

    // Update the user in the database
    db.query(
        "UPDATE users SET name = ?, username = ?, licenseplate = ? WHERE id = ?",
        [name, username, licenseplate, userId],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User updated successfully" });
        }
    );
});

// API to update user profile image
app.put("/user/:id/image", upload.single("profileimage"), (req, res) => {
    const userId = req.params.id;
    const imagePath = `/uploads/${req.file.filename}`; // Save relative path

    db.query(
        "UPDATE users SET profileimage = ? WHERE id = ?",
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

app.listen(5000, () => console.log('Server running on port 5000'));

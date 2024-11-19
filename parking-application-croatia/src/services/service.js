import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

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

// Registration endpoint
app.post('/register', async (req, res) => {
    const {id, name, surname, username, password, licenseplate, spareplate } = req.body;
    
    // Validate that required fields are provided
    if (!name || !surname || !username || !password || !licenseplate) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    
    try {
        const hash = await bcrypt.hash(password, 10); // Hash the password
        const uId = uuidv4();

        // Insert the user into the database
        db.query(
            'INSERT INTO users (id, name, surname, username, password, licenseplate, spareplate) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uId, name, surname, username, hash, licenseplate, spareplate || null],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Error registering user' });
                }

                const token = jwt.sign({ id: results[0].id, username: results[0].username }, SECRET, {
                    expiresIn: "1d",
                });
        
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false, // Set to true if using HTTPS
                });
                res.status(200).json({ message: 'User registered', userId: id });
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

        const user = { id: results[0].id, username: results[0].username };
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

app.listen(5000, () => console.log('Server running on port 5000'));

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { validationResult } from 'express-validator';

//register new user
const register = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        const { email, username, password, role } = req.body;

        //check if user is already registered
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already registered' });
        }

        //hash password with 10 salt rounds
        const passwordHash = await bcrypt.hash(password, 10);

        //validate role
        const validRoles = ['user', 'admin', 'read-only'];
        const userRole = validRoles.includes(role) ? role : 'user';

        const response = await pool.query('INSERT INTO users (email, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role',
            [email, username, passwordHash, userRole]);

        const newUser = response.rows[0];

        //generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        return res.status(201).json({
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            },
            token,
        })

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}

//login user
const login = async(req, res) => {

    try{
        
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        const {email, password} = req.body;

        //find user by email
        const response = await pool.query('SELECT id, email, username, password_hash, role FROM users WHERE email = $1', [email]);

        if(response.rows.length === 0) {
            return  res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = response.rows[0];

        //compare password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if(!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token,
        })

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

export { register, login };
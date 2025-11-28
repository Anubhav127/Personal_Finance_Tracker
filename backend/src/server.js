import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import analytics from './routes/analytics.js';
import transaction from './routes/transactions.js';
import users from './routes/users.js';
import { xss } from 'express-xss-sanitizer'
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());

// CORS configuration
app.use(cors({
    origin: ['https://personal-finance-tracker-tawny-seven.vercel.app/', '*'],
    methods: ['GET', 'POST', 'PATCH', 'PUT' ,'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Routes
app.use('/api/auth', auth);
app.use('/api/analytics', analytics);
app.use('/api/transactions', transaction);
app.use('/api/users', users);


app.get('/', (req, res) => {
    res.send('Personal Finance Tracker API');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;


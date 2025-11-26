import express from 'express';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 5000;

//security middleware
app.use(helmet());

//cors configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Personal Finance Tracker API');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;


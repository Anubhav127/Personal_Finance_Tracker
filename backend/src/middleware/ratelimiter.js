import limiter from 'express-rate-limit';

const authlimiter = limiter({
    windowMs: 15*60*1000,
    limit: 5,
    message: 'Too many authentication attempts, try agian later',
});

const transactionlimiter = limiter({
    windowMs: 60*60*1000,
    limit: 100,
    message: 'Too many transactions requests, try again later',
});

const analyticslimiter = limiter({
    windowMs: 60*60*1000,
    limit: 50,
    message: 'Too many analytics requests, try again later',
});

export { authlimiter, transactionlimiter, analyticslimiter };
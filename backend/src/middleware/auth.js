import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {

    try{

        //get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        //verify token
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = {
                userId: user.userId,
                role: user.role,
            };
            next();
        });

    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default authenticateToken;
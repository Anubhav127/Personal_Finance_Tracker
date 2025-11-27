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

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'User is not authenticated' });
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Not Valid Role' });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
}

export { authenticateToken, authorizeRoles };
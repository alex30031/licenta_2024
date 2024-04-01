import jwt from 'jsonwebtoken';

const secret = 'secret';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const user = jwt.verify(token, secret);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
}
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { User } from '../models/User.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: { message: 'Missing auth token' } });
    }

    const token = header.slice('Bearer '.length);
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.sub).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid token' } });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { message: 'Unauthorized' } });
    if (req.user.role !== role) return res.status(403).json({ error: { message: 'Forbidden' } });
    next();
  };
}

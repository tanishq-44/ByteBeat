import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { verifyToken } from '../utils/jwt';

// Protect routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }

    const user = await User.findById(decoded.id).select('-password') as IUser | null;
    
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
      return;
    }
    next();
  };
}; 
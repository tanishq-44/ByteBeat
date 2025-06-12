const jwt = require('jsonwebtoken');

export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
}; 
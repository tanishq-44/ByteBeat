const jwt = require('jsonwebtoken');

interface TokenPayload {
  id: string;
}

/**
 * Generate a JWT token
 * @param id The user ID to include in the token
 * @returns The generated token string
 */
export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  try {
    return jwt.sign({ id }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });
  } catch (error) {
    console.error('JWT Sign Error:', error);
    return '';
  }
};

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns The decoded token payload
 */
export const verifyToken = (token: string): TokenPayload | null => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    console.error('JWT Verify Error:', error);
    return null;
  }
}; 
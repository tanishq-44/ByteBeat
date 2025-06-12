"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jwt = require('jsonwebtoken');
/**
 * Generate a JWT token
 * @param id The user ID to include in the token
 * @returns The generated token string
 */
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    try {
        return jwt.sign({ id }, secret, {
            expiresIn: process.env.JWT_EXPIRE || '30d',
        });
    }
    catch (error) {
        console.error('JWT Sign Error:', error);
        return '';
    }
};
exports.generateToken = generateToken;
/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns The decoded token payload
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    try {
        return jwt.verify(token, secret);
    }
    catch (error) {
        console.error('JWT Verify Error:', error);
        return null;
    }
};
exports.verifyToken = verifyToken;

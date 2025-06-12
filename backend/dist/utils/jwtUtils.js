"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jwt = require('jsonwebtoken');
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    return jwt.sign({ id }, secret, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};
exports.generateToken = generateToken;

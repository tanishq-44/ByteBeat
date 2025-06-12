"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        // Create user
        const user = yield User_1.default.create({
            name,
            email,
            password,
        });
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString());
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check for user
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // Check if password matches
        const isMatch = yield user.matchPassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString());
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.login = login;

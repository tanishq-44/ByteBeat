"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Basic route
app.get('/', (req, res) => {
    res.send('ByteBeat API is running...');
});
// Mount routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/blogs', blogRoutes_1.default);
// Protected routes
// Example: app.use('/api/admin', protect, authorize('admin'), adminRoutes);
// Start server
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
});

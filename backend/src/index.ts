import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import { protect, authorize } from './middleware/authMiddleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('ByteBeat API is running...');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Protected routes
// Example: app.use('/api/admin', protect, authorize('admin'), adminRoutes);

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}); 
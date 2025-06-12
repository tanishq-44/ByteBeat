import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment,
  getUserBlogs,
  getMyBlogs
} from '../controllers/blogController';
import { protect } from '../middleware/authMiddleware';
import Blog from '../models/Blog';

const router = express.Router();

// Public routes
router.get('/', getBlogs);

// User blogs routes - these must come BEFORE the /:id route to avoid conflicts
// Get current user's blogs
router.get('/user/me', protect, getMyBlogs);

// Get blogs by user ID
router.get('/user/:userId', getUserBlogs);

// This must come after the more specific routes
router.get('/:id', getBlog);

// Protected routes
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

// Like routes
router.put('/:id/like', protect, likeBlog);

// Comment routes
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:comment_id', protect, deleteComment);

export default router; 
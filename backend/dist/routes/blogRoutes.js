"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.get('/', blogController_1.getBlogs);
router.get('/:id', blogController_1.getBlog);
// Protected routes
router.post('/', authMiddleware_1.protect, blogController_1.createBlog);
router.put('/:id', authMiddleware_1.protect, blogController_1.updateBlog);
router.delete('/:id', authMiddleware_1.protect, blogController_1.deleteBlog);
// Like routes
router.put('/:id/like', authMiddleware_1.protect, blogController_1.likeBlog);
// Comment routes
router.post('/:id/comments', authMiddleware_1.protect, blogController_1.addComment);
router.delete('/:id/comments/:comment_id', authMiddleware_1.protect, blogController_1.deleteComment);
exports.default = router;

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
exports.deleteComment = exports.addComment = exports.likeBlog = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlog = exports.getBlogs = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = yield Blog_1.default.countDocuments();
        const query = {};
        // Search by keyword
        if (req.query.keyword) {
            query.$text = { $search: req.query.keyword };
        }
        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }
        // Filter by tag
        if (req.query.tag) {
            query.tags = { $in: [req.query.tag] };
        }
        const blogs = yield Blog_1.default.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }
        res.status(200).json({
            success: true,
            count: blogs.length,
            pagination,
            data: blogs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.getBlogs = getBlogs;
// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog_1.default.findById(req.params.id).populate('author', 'name avatar');
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.status(200).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.getBlog = getBlog;
// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Add user to req.body
        req.body.author = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const blog = yield Blog_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.createBlog = createBlog;
// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let blog = yield Blog_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        // Make sure user is blog author
        if (blog.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            res.status(401).json({
                success: false,
                message: 'Not authorized to update this blog',
            });
            return;
        }
        blog = yield Blog_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.updateBlog = updateBlog;
// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        // Make sure user is blog author
        if (blog.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            res.status(401).json({
                success: false,
                message: 'Not authorized to delete this blog',
            });
            return;
        }
        yield blog.deleteOne();
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.deleteBlog = deleteBlog;
// @desc    Like a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
const likeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        // Check if the blog has already been liked by the user
        if (blog.likes.some((like) => { var _a; return like.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); })) {
            // Remove the like
            blog.likes = blog.likes.filter((like) => { var _a; return like.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); });
        }
        else {
            // Add the like
            blog.likes.push((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        }
        yield blog.save();
        res.status(200).json({
            success: true,
            data: blog.likes,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.likeBlog = likeBlog;
// @desc    Add comment to a blog
// @route   POST /api/blogs/:id/comments
// @access  Private
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        const newComment = {
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            text: req.body.text,
            name: (_b = req.user) === null || _b === void 0 ? void 0 : _b.name,
            avatar: (_c = req.user) === null || _c === void 0 ? void 0 : _c.avatar,
        };
        blog.comments.unshift(newComment);
        yield blog.save();
        res.status(201).json({
            success: true,
            data: blog.comments,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.addComment = addComment;
// @desc    Delete comment from a blog
// @route   DELETE /api/blogs/:id/comments/:comment_id
// @access  Private
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        // Pull out comment
        const comment = blog.comments.find((comment) => comment._id.toString() === req.params.comment_id);
        // Make sure comment exists
        if (!comment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }
        // Check user is comment author or blog author or admin
        if (comment.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) &&
            blog.author.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) &&
            ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== 'admin') {
            res.status(401).json({
                success: false,
                message: 'Not authorized to delete this comment',
            });
            return;
        }
        // Get remove index
        blog.comments = blog.comments.filter((comment) => comment._id.toString() !== req.params.comment_id);
        yield blog.save();
        res.status(200).json({
            success: true,
            data: blog.comments,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error',
        });
    }
});
exports.deleteComment = deleteComment;

import { Request, Response } from 'express';
import Blog from '../models/Blog';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Blog.countDocuments();

    const query: any = {};

    // Search by keyword
    if (req.query.keyword) {
      query.$text = { $search: req.query.keyword as string };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const pagination: any = {};

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name avatar');

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    // Add user to req.body
    req.body.author = req.user?.id;

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }

    // Make sure user is blog author
    if (blog.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(401).json({
        success: false,
        message: 'Not authorized to update this blog',
      });
      return;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }

    // Make sure user is blog author
    if (blog.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(401).json({
        success: false,
        message: 'Not authorized to delete this blog',
      });
      return;
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Like a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }

    // Check if the blog has already been liked by the user
    if (blog.likes.some((like) => like.toString() === req.user?.id)) {
      // Remove the like
      blog.likes = blog.likes.filter((like) => like.toString() !== req.user?.id);
    } else {
      // Add the like
      blog.likes.push(req.user?.id as any);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog.likes,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Add comment to a blog
// @route   POST /api/blogs/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }

    const newComment = {
      user: req.user?.id,
      text: req.body.text,
      name: req.user?.name,
      avatar: req.user?.avatar,
    };

    blog.comments.unshift(newComment as any);

    await blog.save();

    res.status(201).json({
      success: true,
      data: blog.comments,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Delete comment from a blog
// @route   DELETE /api/blogs/:id/comments/:comment_id
// @access  Private
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }

    // Pull out comment
    const comment = blog.comments.find(
      (comment) => (comment as any)._id.toString() === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      res.status(404).json({ success: false, message: 'Comment not found' });
      return;
    }

    // Check user is comment author or blog author or admin
    if (
      (comment.user as any).toString() !== req.user?.id &&
      blog.author.toString() !== req.user?.id &&
      req.user?.role !== 'admin'
    ) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
      return;
    }

    // Get remove index
    blog.comments = blog.comments.filter(
      (comment) => (comment as any)._id.toString() !== req.params.comment_id
    );

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog.comments,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get blogs by user ID
// @route   GET /api/blogs/user/:userId
// @access  Public
export const getUserBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Validate that userId is a valid ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
      return;
    }
    
    const blogs = await Blog.find({ author: userId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error: any) {
    console.error('Error fetching user blogs by ID:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get current user's blogs
// @route   GET /api/blogs/user/me
// @access  Private
export const getMyBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ author: req.user?.id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error: any) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
}; 
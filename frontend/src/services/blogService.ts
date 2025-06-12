import api from './api';

export interface IBlog {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  image?: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  category: string;
  likes: string[];
  comments: {
    _id: string;
    user: string;
    text: string;
    name: string;
    avatar?: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogFormData {
  title: string;
  content: string;
  summary?: string;
  image?: File;
  tags?: string[];
  category: string;
}

const BlogService = {
  // Get all blogs with optional filters
  getBlogs: async (
    page = 1,
    limit = 10,
    keyword = '',
    category = '',
    tag = ''
  ) => {
    const response = await api.get('/blogs', {
      params: { page, limit, keyword, category, tag },
    });
    return response.data;
  },

  // Get single blog
  getBlog: async (id: string) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  // Create blog
  createBlog: async (blogData: BlogFormData) => {
    // Handle file upload if image exists
    let imageUrl = '';
    if (blogData.image) {
      const formData = new FormData();
      formData.append('image', blogData.image);
      const uploadResponse = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      imageUrl = uploadResponse.data.url;
    }

    const response = await api.post('/blogs', {
      ...blogData,
      image: imageUrl,
    });
    return response.data;
  },

  // Update blog
  updateBlog: async (id: string, blogData: BlogFormData) => {
    // Handle file upload if image exists and is a File object
    let imageUrl = typeof blogData.image === 'string' ? blogData.image : '';
    if (blogData.image instanceof File) {
      const formData = new FormData();
      formData.append('image', blogData.image);
      const uploadResponse = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      imageUrl = uploadResponse.data.url;
    }

    const response = await api.put(`/blogs/${id}`, {
      ...blogData,
      image: imageUrl,
    });
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id: string) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // Like/unlike blog
  likeBlog: async (id: string) => {
    const response = await api.put(`/blogs/${id}/like`);
    return response.data;
  },

  // Add comment
  addComment: async (id: string, text: string) => {
    const response = await api.post(`/blogs/${id}/comments`, { text });
    return response.data;
  },

  // Delete comment
  deleteComment: async (blogId: string, commentId: string) => {
    const response = await api.delete(`/blogs/${blogId}/comments/${commentId}`);
    return response.data;
  },

  // Get user blogs
  getUserBlogs: async () => {
    try {
      // First try the '/blogs/user/me' endpoint which should work with the auth token
      try {
        const response = await api.get('/blogs/user/me');
        return response.data;
      } catch (tokenError) {
        console.log('User blogs token approach failed, trying with ID:', tokenError);
        
        // Fall back to explicit user ID approach
        const userInfo = localStorage.getItem('user');
        let userId = '';
        
        if (userInfo) {
          const user = JSON.parse(userInfo);
          // Try different property names for user ID
          userId = user.id || user._id;
          
          console.log('BlogService.getUserBlogs using userId:', userId);
          
          if (!userId) {
            console.error('No valid user ID found in stored user data:', user);
            throw new Error('User ID not available. Please log in again.');
          }
          
          // Make the request with the explicit user ID
          const response = await api.get(`/blogs/user/${userId}`);
          return response.data;
        } else {
          throw new Error('User not logged in');
        }
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw error;
    }
  },
};

export default BlogService; 
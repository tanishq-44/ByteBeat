import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { FiHeart, FiMessageSquare, FiEdit, FiTrash2, FiClock, FiUser, FiTag, FiShare2, FiBookmark, FiChevronLeft } from 'react-icons/fi';
import { DEFAULT_AVATAR } from '../utils/constants';

interface Comment {
  _id: string;
  text: string;
  name: string;
  avatar?: string;
  user: string;
  date: string;
}

interface Blog {
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
  category: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

const SingleBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch blog');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogs/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update blog with new likes array
      if (blog) {
        setBlog({
          ...blog,
          likes: res.data.data,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to like blog');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) {
      navigate('/login');
      return;
    }

    if (!comment.trim()) return;
    
    setSubmittingComment(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/blogs/${id}/comments`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update blog with new comments array
      if (blog) {
        setBlog({
          ...blog,
          comments: res.data.data,
        });
      }
      
      // Clear comment input
      setComment('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || !token) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/blogs/${id}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update blog with new comments array
      if (blog) {
        setBlog({
          ...blog,
          comments: res.data.data,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleDeleteBlog = async () => {
    if (!user || !token) return;
    
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate('/blogs');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete blog');
      }
    }
  };
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Get category color based on name
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Technology': 'from-indigo-500 to-blue-500',
      'Programming': 'from-teal-500 to-green-500',
      'Design': 'from-purple-500 to-pink-500',
      'Business': 'from-amber-500 to-orange-500',
      'Lifestyle': 'from-rose-500 to-red-500',
      'Health': 'from-green-500 to-emerald-500',
      'Other': 'from-gray-500 to-slate-500'
    };
    
    return categoryColors[category] || 'from-gray-500 to-slate-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin text-teal-500 w-8 h-8 border-4 border-current border-t-transparent rounded-full"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-600">Loading blog...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error loading blog</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => navigate('/blogs')}
                className="mt-3 flex items-center text-red-700 hover:text-red-800 transition-colors"
              >
                <FiChevronLeft className="mr-1" /> Back to blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h2>
        <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/blogs" 
          className="inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
        >
          <FiChevronLeft className="mr-2" /> Back to blogs
        </Link>
      </div>
    );
  }

  const isAuthor = user && blog.author._id === user.id;
  const isAdmin = user && user.role === 'admin';
  const isLiked = user && blog.likes.includes(user.id);

  return (
    <div className="pt-8 bg-gray-50">
      {/* Back to blogs */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          to="/blogs" 
          className="inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors"
        >
          <FiChevronLeft className="mr-1" /> Back to blogs
        </Link>
      </div>
      
      {/* Hero section with image */}
      {blog.image && (
        <div className="w-full h-96 relative overflow-hidden bg-gray-900">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 md:left-8">
            <Link 
              to={`/blogs?category=${blog.category}`}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(blog.category)} shadow-md hover:shadow-lg transition-shadow`}
            >
              <FiTag className="mr-1" />
              {blog.category}
            </Link>
          </div>
        </div>
      )}
      
      <div className={`container mx-auto px-4 ${blog.image ? '-mt-32 relative z-10' : 'pt-8'}`}>
        <article className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto mb-10">
          <div className="p-6 md:p-10">
            {/* Title and actions */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">{blog.title}</h1>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${
                    isLiked 
                      ? 'bg-red-50 text-red-500 border-red-200' 
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {isLiked ? <FiHeart className="fill-current" /> : <FiHeart />}
                  <span>{blog.likes.length}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors relative"
                >
                  <FiShare2 />
                  <span>Share</span>
                  
                  {showShareOptions && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 w-48">
                      <div className="flex flex-col space-y-2">
                        <button className="flex items-center space-x-2 hover:text-teal-600 transition-colors py-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                          </svg>
                          <span>Twitter</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-teal-600 transition-colors py-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                          </svg>
                          <span>Facebook</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-teal-600 transition-colors py-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                          </svg>
                          <span>Instagram</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-teal-600 transition-colors py-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                          </svg>
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>
                  )}
                </button>
                
                <button
                  className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FiBookmark />
                  <span>Save</span>
                </button>
                
                {(isAuthor || isAdmin) && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/edit-blog/${id}`}
                      className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-blue-500 border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <FiEdit />
                      <span className="hidden md:inline">Edit</span>
                    </Link>
                    <button
                      onClick={handleDeleteBlog}
                      className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 />
                      <span className="hidden md:inline">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Author and date info */}
            <div className="flex items-center mb-8 text-gray-600">
              <Link to={`/blogs?author=${blog.author._id}`} className="flex items-center group">
                <img
                  src={blog.author.avatar || DEFAULT_AVATAR}
                  alt={blog.author.name}
                  className="w-10 h-10 rounded-full mr-3 border-2 border-transparent group-hover:border-teal-400 transition-all duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = DEFAULT_AVATAR;
                  }}
                />
                <div>
                  <div className="flex items-center">
                    <FiUser className="text-teal-500 mr-1" />
                    <span className="font-medium group-hover:text-teal-600 transition-colors">{blog.author.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" />
                    <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blogs?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Blog content */}
            <div 
              className="prose prose-lg max-w-none mb-10 blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Comment section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FiMessageSquare className="mr-2 text-teal-500" />
                Comments ({blog.comments.length})
              </h2>
              
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-10">
                  <div className="flex items-start space-x-4">
                    <img
                      src={user.avatar || DEFAULT_AVATAR}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div className="flex-grow">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                        rows={3}
                        required
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={submittingComment || !comment.trim()}
                          className={`px-4 py-2 rounded-lg ${
                            submittingComment || !comment.trim()
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-teal-500 hover:bg-teal-600 text-white transition-colors'
                          }`}
                        >
                          {submittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mb-8">
                  <p className="text-gray-700 mb-4">Please sign in to leave a comment.</p>
                  <Link
                    to="/login"
                    className="inline-block px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
              
              {blog.comments.length > 0 ? (
                <div className="space-y-6">
                  {blog.comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-4 animate-fade-in">
                      <img
                        src={comment.avatar || DEFAULT_AVATAR}
                        alt={comment.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div className="flex-grow">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{comment.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(comment.date).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                        
                        {(user?.id === comment.user || isAdmin) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 text-sm mt-1 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlog; 
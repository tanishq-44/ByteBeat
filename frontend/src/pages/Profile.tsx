import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import BlogService, { IBlog } from '../services/blogService';
import { DEFAULT_AVATAR } from '../utils/constants';

interface Blog {
  _id: string;
  title: string;
  summary?: string;
  category: string;
  likes: string[];
  comments: any[];
  createdAt: string;
}

const Profile: React.FC = () => {
  const [userBlogs, setUserBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Debug auth information
    console.log('Auth state:', { isAuthenticated, user, token: token ? 'Token exists' : 'No token' });
    
    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use the improved BlogService that tries multiple approaches
        const response = await BlogService.getUserBlogs();
        
        if (response && response.data) {
          setUserBlogs(response.data);
        } else {
          console.warn('Unexpected response format:', response);
          setUserBlogs([]);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching user blogs:', err);
        setError(err.message || 'Failed to fetch your blogs');
        setUserBlogs([]);
        setLoading(false);
      }
    };

    if (user) {
      setName(user.name);
      fetchUserBlogs();
    }
  }, [isAuthenticated, navigate, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatar) return null;
    
    const formData = new FormData();
    formData.append('file', avatar);
    formData.append('upload_preset', 'bytebeat_uploads');
    
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }
    
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      const avatarUrl = avatar ? await uploadAvatar() : undefined;
      
      const userData: any = { name };
      if (password) userData.password = password;
      if (avatarUrl) userData.avatar = avatarUrl;
      
      await axios.put(
        'http://localhost:5000/api/users/profile',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUpdateSuccess('Profile updated successfully');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await BlogService.deleteBlog(blogId);
        
        // Update blogs list
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete blog');
      }
    }
  };

  if (!isAuthenticated || !user) {
    return <div className="container mx-auto p-4 text-center">Please login to view your profile</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Section */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-gray-200">
              {avatarPreview || user.avatar ? (
                <img
                  src={avatarPreview || user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = DEFAULT_AVATAR;
                  }}
                />
              ) : (
                <img
                  src={DEFAULT_AVATAR}
                  alt="Default avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {!isEditing ? (
              <>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize mt-1">
                  Role: {user.role}
                </p>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile} className="mt-4">
                {updateError && (
                  <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                    {updateError}
                  </div>
                )}
                {updateSuccess && (
                  <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
                    {updateSuccess}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Avatar
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      updateLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {updateLoading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* User Blogs Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Blog Posts</h2>
              <button
                onClick={() => navigate('/create-blog')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FaIcons.FaPlusCircle className="mr-2" />
                New Post
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-8">Loading your blogs...</div>
            ) : userBlogs.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>You haven't created any blog posts yet.</p>
                <p className="mt-2">
                  <button
                    onClick={() => navigate('/create-blog')}
                    className="text-blue-600 hover:underline"
                  >
                    Create your first blog post
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userBlogs.map((blog) => (
                  <div key={blog._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold">
                        <Link
                          to={`/blogs/${blog._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {blog.title}
                        </Link>
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/edit-blog/${blog._id}`)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit blog"
                        >
                          <FaIcons.FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete blog"
                        >
                          <FaIcons.FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-gray-600">
                        {blog.summary || blog.title}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                      <div>
                        <span className="bg-gray-200 px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </div>
                      <div className="flex space-x-4">
                        <span>{blog.likes.length} likes</span>
                        <span>{blog.comments.length} comments</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
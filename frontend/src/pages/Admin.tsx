import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

interface BlogStats {
  total: number;
  categories: { [key: string]: number };
  topLiked: { _id: string; title: string; likes: number }[];
  topCommented: { _id: string; title: string; comments: number }[];
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'blogs'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, token, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'dashboard' || activeTab === 'blogs') {
          // Fetch blog stats
          const blogRes = await axios.get('http://localhost:5000/api/blogs/stats', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBlogStats(blogRes.data.data);
        }
        
        if (activeTab === 'users') {
          // Fetch users
          const userRes = await axios.get('http://localhost:5000/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(userRes.data.data);
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, isAdmin, isAuthenticated, navigate, token]);
  
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Update users list
        setUsers(users.filter(user => user._id !== userId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };
  
  const handleChangeRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update users list
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };
  
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto p-4 text-center">
        You do not have permission to access this page.
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 flex items-center ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          {FaIcons.FaChartLine({ className: "mr-2" })}
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 flex items-center ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          {FaIcons.FaUsers({ className: "mr-2" })}
          Users
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-4 py-2 flex items-center ${
            activeTab === 'blogs'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          {FaIcons.FaNewspaper({ className: "mr-2" })}
          Blogs
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">Loading data...</div>
      ) : (
        <>
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && blogStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Blog Statistics</h2>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {blogStats.total}
                </div>
                <p className="text-gray-600">Total Blog Posts</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  {Object.entries(blogStats.categories).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span>{category}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Manage Users
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Most Liked Posts</h2>
                {blogStats.topLiked.length > 0 ? (
                  <div className="space-y-2">
                    {blogStats.topLiked.map((blog) => (
                      <div key={blog._id} className="flex justify-between items-center">
                        <a
                          href={`/blogs/${blog._id}`}
                          className="text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {blog.title}
                        </a>
                        <span className="font-semibold">{blog.likes} likes</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No liked posts yet</p>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Most Commented</h2>
                {blogStats.topCommented.length > 0 ? (
                  <div className="space-y-2">
                    {blogStats.topCommented.map((blog) => (
                      <div key={blog._id} className="flex justify-between items-center">
                        <a
                          href={`/blogs/${blog._id}`}
                          className="text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {blog.title}
                        </a>
                        <span className="font-semibold">{blog.comments} comments</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No commented posts yet</p>
                )}
              </div>
            </div>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user._id !== user?._id && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() =>
                                  handleChangeRole(
                                    user._id,
                                    user.role === 'admin' ? 'user' : 'admin'
                                  )
                                }
                                className="text-blue-600 hover:text-blue-900"
                                title={`Make ${user.role === 'admin' ? 'User' : 'Admin'}`}
                              >
                                {FaIcons.FaUserEdit({ size: 18 })}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete User"
                              >
                                {FaIcons.FaTrash({ size: 18 })}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Blogs Tab */}
          {activeTab === 'blogs' && blogStats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Blog Posts</h2>
                <a
                  href="/blogs"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View All Blogs
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Popular Categories</h3>
                  <div className="space-y-2">
                    {Object.entries(blogStats.categories)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([category, count]) => (
                        <div key={category} className="flex justify-between">
                          <span>{category}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Most Liked</h3>
                  <div className="space-y-2">
                    {blogStats.topLiked.slice(0, 5).map((blog) => (
                      <div key={blog._id} className="flex justify-between items-center">
                        <a
                          href={`/blogs/${blog._id}`}
                          className="text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {blog.title}
                        </a>
                        <span className="font-semibold">{blog.likes} likes</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Most Commented</h3>
                  <div className="space-y-2">
                    {blogStats.topCommented.slice(0, 5).map((blog) => (
                      <div key={blog._id} className="flex justify-between items-center">
                        <a
                          href={`/blogs/${blog._id}`}
                          className="text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {blog.title}
                        </a>
                        <span className="font-semibold">{blog.comments} comments</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin; 
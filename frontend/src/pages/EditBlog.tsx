import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categories = [
  'Technology',
  'Programming',
  'Design',
  'Business',
  'Lifestyle',
  'Health',
  'Other',
];

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        const blog = res.data.data;
        
        // Check if user is the author or admin
        if (user && (user.id === blog.author._id || user.role === 'admin')) {
          setTitle(blog.title);
          setContent(blog.content);
          setSummary(blog.summary || '');
          setCategory(blog.category);
          setTags(blog.tags.join(', '));
          setCurrentImage(blog.image || null);
          setFetchLoading(false);
        } else {
          // Not authorized to edit
          navigate(`/blogs/${id}`);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch blog');
        setFetchLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, isAuthenticated, navigate, user]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!image) return currentImage;
    
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'bytebeat_uploads');
    
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Error uploading image:', err);
      return currentImage;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Upload image if changed
      const imageUrl = image ? await uploadImage() : currentImage;
      
      // Process tags
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Update blog post
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        {
          title,
          content,
          summary: summary || undefined,
          category,
          tags: tagsArray,
          image: imageUrl || undefined,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Redirect to the blog post
      navigate(`/blogs/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };
  
  // Configure Quill modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };
  
  if (fetchLoading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary (optional)
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            maxLength={200}
          />
          <p className="text-sm text-gray-500 mt-1">
            {summary.length}/200 characters
          </p>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. javascript, react, web development"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          
          {currentImage && !imagePreview && (
            <div className="mb-2">
              <p className="text-sm mb-1">Current image:</p>
              <img
                src={currentImage}
                alt="Current"
                className="h-40 object-cover rounded-md"
              />
            </div>
          )}
          
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm mb-1">New image:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-64 mb-12" // Extra margin bottom for Quill toolbar
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/blogs/${id}`)}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog; 
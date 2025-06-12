import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import { IBlog } from '../services/blogService';
import BlogService from '../services/blogService';
import { FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';

interface BlogListProps {
  category?: string;
  tag?: string;
  keyword?: string;
  authorId?: string;
}

const BlogList: React.FC<BlogListProps> = ({ category, tag, keyword, authorId }) => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, tag, keyword, authorId]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getBlogs(
        page,
        6,
        keyword || '',
        category || '',
        tag || ''
      );

      // Filter by author if authorId is provided
      const filteredBlogs = authorId
        ? response.data.filter((blog: IBlog) => blog.author._id === authorId)
        : response.data;

      setBlogs(filteredBlogs);
      setTotalPages(Math.ceil(response.count / 6));
      setError('');
      setIsInitialLoad(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <FiLoader className="animate-spin text-teal-500 w-8 h-8" />
          </div>
          <div className="absolute inset-0 border-t-4 border-teal-500 opacity-25 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">Error loading blogs</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">No blogs found</h3>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          {keyword
            ? `No blogs match the search term "${keyword}"`
            : category
            ? `No blogs found in category "${category}"`
            : tag
            ? `No blogs found with tag "${tag}"`
            : authorId
            ? `This user hasn't published any blogs yet`
            : `There are no blogs published yet`}
        </p>
      </div>
    );
  }

  return (
    <div>
      {loading && !isInitialLoad && (
        <div className="fixed top-20 right-6 bg-teal-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <FiLoader className="animate-spin mr-2" />
          Loading...
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog._id} className="animate-fade-in">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`flex items-center px-4 py-2 rounded-l-lg border ${
                page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 border-gray-200 transition-colors duration-300'
              }`}
            >
              <FiChevronLeft className="mr-1" />
              Previous
            </button>
            
            <div className="px-4 py-2 bg-white border-t border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Page <span className="text-teal-600">{page}</span> of <span className="text-teal-600">{totalPages}</span>
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`flex items-center px-4 py-2 rounded-r-lg border ${
                page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 border-gray-200 transition-colors duration-300'
              }`}
            >
              Next
              <FiChevronRight className="ml-1" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogList; 
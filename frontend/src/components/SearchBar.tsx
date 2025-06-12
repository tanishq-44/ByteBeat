import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  'Technology',
  'Programming',
  'Design',
  'Business',
  'Lifestyle',
  'Health',
  'Other',
];

const SearchBar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let searchQuery = '/blogs';
    const params = new URLSearchParams();
    
    if (keyword) {
      params.append('keyword', keyword);
    }
    
    if (category) {
      params.append('category', category);
    }
    
    if (params.toString()) {
      searchQuery += `?${params.toString()}`;
    }
    
    navigate(searchQuery);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Search Blogs
            </label>
            <input
              type="text"
              id="keyword"
              placeholder="Search by title, content, or tags..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 
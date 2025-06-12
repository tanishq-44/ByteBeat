import React from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogList from '../components/BlogList';
import SearchBar from '../components/SearchBar';

const Blogs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {category
          ? `${category} Blogs`
          : tag
          ? `Blogs tagged with "${tag}"`
          : keyword
          ? `Search Results for "${keyword}"`
          : 'All Blogs'}
      </h1>

      <SearchBar />

      <BlogList keyword={keyword} category={category} tag={tag} />
    </div>
  );
};

export default Blogs; 
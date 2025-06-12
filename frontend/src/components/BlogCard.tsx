import React from 'react';
import { Link } from 'react-router-dom';
import { IBlog } from '../services/blogService';
import { FiClock, FiHeart, FiMessageSquare, FiTag } from 'react-icons/fi';
import { DEFAULT_AVATAR } from '../utils/constants';

interface BlogCardProps {
  blog: IBlog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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

  // Get category text color based on name
  const getCategoryTextColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Technology': 'bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent',
      'Programming': 'bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent',
      'Design': 'bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent',
      'Business': 'bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent',
      'Lifestyle': 'bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent',
      'Health': 'bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent',
      'Other': 'bg-gradient-to-r from-gray-500 to-slate-500 bg-clip-text text-transparent'
    };
    
    return categoryColors[category] || categoryColors['Other'];
  };

  // Get pattern overlay based on category
  const getCategoryPattern = (category: string) => {
    const patterns: Record<string, string> = {
      'Technology': 'bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0,_rgba(99,102,241,0)_50%)] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]',
      'Programming': 'bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.15)_0,_rgba(20,184,166,0)_50%)] [mask-image:linear-gradient(120deg,white,rgba(255,255,255,0))]',
      'Design': 'bg-[radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.15)_0,_rgba(168,85,247,0)_50%)] [mask-image:linear-gradient(240deg,white,rgba(255,255,255,0))]',
      'Business': 'bg-[radial-gradient(ellipse_at_top_left,_rgba(245,158,11,0.15)_0,_rgba(245,158,11,0)_50%)] [mask-image:linear-gradient(60deg,white,rgba(255,255,255,0))]',
      'Lifestyle': 'bg-[radial-gradient(circle_at_bottom_right,_rgba(244,63,94,0.15)_0,_rgba(244,63,94,0)_50%)] [mask-image:linear-gradient(300deg,white,rgba(255,255,255,0))]',
      'Health': 'bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.15)_0,_rgba(34,197,94,0)_50%)] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]',
      'Other': 'bg-[radial-gradient(circle_at_center,_rgba(107,114,128,0.15)_0,_rgba(107,114,128,0)_50%)] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]'
    };
    
    return patterns[category] || patterns['Other'];
  };

  // Get background patterns for placeholder images
  const getCategoryBackground = (category: string) => {
    const patterns: Record<string, string> = {
      'Technology': `bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`,
      'Programming': `bg-[url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%2314b8a6' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")]`,
      'Design': `bg-[url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a855f7' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")]`,
      'Business': `bg-[url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")]`,
      'Lifestyle': `bg-[url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f43f5e' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")]`,
      'Health': `bg-[url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 12c0-.622-.095-1.221-.27-1.785A5.982 5.982 0 0 0 10 12c1.67 0 3.182-.683 4.27-1.785A5.998 5.998 0 0 0 14 12h2a4 4 0 0 1 4-4V6c-1.67 0-3.182.683-4.27 1.785C15.905 7.22 16 6.622 16 6c0-.622-.095-1.221-.27-1.785A5.982 5.982 0 0 0 20 6V4a4 4 0 0 1-4-4h-2c0 .622.095 1.221.27 1.785A5.982 5.982 0 0 0 10 0C8.33 0 6.818.683 5.73 1.785 5.905 1.22 6 .622 6 0H4a4 4 0 0 1-4 4v2c1.67 0 3.182-.683 4.27-1.785A5.998 5.998 0 0 1 4 6c0 .622.095 1.221.27 1.785A5.982 5.982 0 0 1 0 6v2a4 4 0 0 1 4 4h2zm-4 0a2 2 0 0 0-2-2v2h2zm16 0a2 2 0 0 1 2-2v2h-2zM0 2a2 2 0 0 0 2-2H0v2zm20 0a2 2 0 0 1-2-2h2v2zm-10 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z' fill='%2322c55e' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")]`,
      'Other': `bg-[url("data:image/svg+xml,%3Csvg width='24' height='20' viewBox='0 0 24 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 18c0-1.105.887-2 1.998-2 1.104 0 2-.895 2.002-1.994V14v6h-4v-2zM0 13.998C0 12.895.888 12 2 12c1.105 0 2 .888 2 2 0 1.105.888 2 2 2 1.105 0 2 .888 2 2v2H0v-6.002zm16 4.004A1.994 1.994 0 0 1 14 20c-1.105 0-2-.888-2-1.998v-2.004A1.994 1.994 0 0 0 10 14c-1.105 0-2-.888-2-1.998v-2.004A1.994 1.994 0 0 1 10 8c1.105 0 2 .888 2 1.998v2.004A1.994 1.994 0 0 0 14 14c1.105 0 2 .888 2 1.998v2.004zM0 6c0-1.105.888-2 2-2h2c0-1.105.888-2 2-2 1.105 0 2 .888 2 2 0 1.105.888 2 2 2 1.105 0 2-.888 2-2 0-1.105.888-2 2-2 1.105 0 2 .888 2 2v2H0V6zm20 0c0-1.105.888-2 2-2 1.105 0 2 .888 2 2v2h-4V6z' fill='%236b7280' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")]`
    };
    
    return patterns[category] || patterns['Other'];
  };

  // Format date to be more readable
  const formatDate = (dateString: string | Date) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="group bg-gradient-to-b from-white to-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full relative">
      {/* Background pattern */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${getCategoryPattern(blog.category)}`}></div>
      
      {/* Category badge at the top */}
      <div className="relative">
        <div className={`h-1.5 bg-gradient-to-r ${getCategoryColor(blog.category)}`}></div>
        <div className={`absolute -bottom-0.5 left-0 w-0 h-1 bg-gradient-to-r ${getCategoryColor(blog.category)} opacity-70 group-hover:w-full transition-all duration-700 ease-in-out`}></div>
      </div>
      
      {/* Image container */}
      <div className="relative overflow-hidden">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-56 object-cover transform group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className={`w-full h-56 bg-gradient-to-br ${getCategoryColor(blog.category)} flex items-center justify-center relative overflow-hidden`}>
            {/* Pattern background */}
            <div className={`absolute inset-0 ${getCategoryBackground(blog.category)} opacity-90`}></div>
            
            {/* Radial overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-20"></div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.4)_0,_rgba(255,255,255,0)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* First letter */}
            <div className="relative z-10">
              <span className="text-white text-5xl font-bold opacity-80 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 shadow-lg">{"Zidio"}</span>
            </div>
            
            {/* Animated particles (subtle dots) */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white animate-pulse"></div>
              <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-white animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute top-1/2 left-2/3 w-1 h-1 rounded-full bg-white animate-pulse" style={{ animationDuration: '2.5s' }}></div>
              <div className="absolute top-1/3 left-3/4 w-1.5 h-1.5 rounded-full bg-white animate-ping" style={{ animationDuration: '4s' }}></div>
            </div>
          </div>
        )}
        
        {/* Date badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-white to-gray-50 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-sm transform group-hover:translate-y-1 group-hover:shadow-md transition-all duration-500">
          <FiClock className="mr-1 text-teal-500" />
          {formatDate(blog.createdAt)}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-grow flex flex-col relative z-10 bg-gradient-to-b from-transparent to-gray-50/30">
        {/* Category */}
        <div className="flex items-center mb-3">
          <FiTag className={`mr-2 text-${blog.category === 'Technology' ? 'indigo' : blog.category === 'Programming' ? 'teal' : blog.category === 'Design' ? 'purple' : 'amber'}-500 transform group-hover:rotate-12 transition-transform duration-500`} />
          <span className={`text-sm font-medium ${getCategoryTextColor(blog.category)}`}>{blog.category}</span>
        </div>
        
        {/* Title */}
        <Link to={`/blogs/${blog._id}`} className="group-hover:text-teal-600 transition-colors duration-300">
          <h2 className="text-xl font-bold mb-3 leading-tight transform group-hover:translate-x-1 transition-transform duration-500 bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:to-indigo-600">
            {blog.title}
          </h2>
        </Link>

        {/* Summary */}
        <p className="text-gray-600 mb-4 text-sm flex-grow">
          {blog.summary
            ? truncateText(blog.summary, 120)
            : truncateText(blog.content.replace(/<[^>]*>?/gm, ''), 120)}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 relative">
          <div className="absolute left-0 top-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent group-hover:w-full transition-all duration-700 ease-in-out"></div>
          
          {/* Author */}
          <Link to={`/blogs?author=${blog.author._id}`} className="flex items-center group/author">
            <img
              src={blog.author.avatar || DEFAULT_AVATAR}
              alt={blog.author.name}
              className="w-8 h-8 rounded-full mr-2 border-2 border-transparent group-hover/author:border-teal-400 transition-all duration-300 transform group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = DEFAULT_AVATAR;
              }}
            />
            <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent group-hover/author:from-teal-500 group-hover/author:to-indigo-500 transition-colors duration-300">{blog.author.name}</span>
          </Link>

          {/* Interactions */}
          <div className="flex space-x-4 text-gray-500 text-sm">
            <div className="flex items-center transform group-hover:translate-y-[-2px] transition-transform duration-500">
              <FiHeart className="mr-1 text-red-400 group-hover:text-red-500 transition-colors duration-300" />
              <span className="bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent group-hover:from-red-500 group-hover:to-pink-500 transition-colors duration-300">{blog.likes.length}</span>
            </div>
            <div className="flex items-center transform group-hover:translate-y-[-2px] transition-transform duration-500">
              <FiMessageSquare className="mr-1 text-blue-400 group-hover:text-blue-500 transition-colors duration-300" />
              <span className="bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-indigo-500 transition-colors duration-300">{blog.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard; 
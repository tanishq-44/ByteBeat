import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BlogList from '../components/BlogList';
import SearchBar from '../components/SearchBar';
import { FiBookOpen, FiSearch, FiArrowRight, FiCode, FiLayout, FiBriefcase, FiLayers } from 'react-icons/fi';
import '../homepage.css'; // We'll create this file next

const categories = [
  { name: 'Technology', icon: <FiCode size={24} />, color: 'from-indigo-500 to-blue-500' },
  { name: 'Programming', icon: <FiLayers size={24} />, color: 'from-teal-500 to-green-500' },
  { name: 'Design', icon: <FiLayout size={24} />, color: 'from-purple-500 to-pink-500' },
  { name: 'Business', icon: <FiBriefcase size={24} />, color: 'from-amber-500 to-orange-500' },
];

const Home: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const fullText = 'Welcome to ByteBeat';
  const location = useLocation();

  // Handle typing effect
  useEffect(() => {
    if (isLoaded) {
      if (displayText.length < fullText.length) {
        const timeoutId = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 100); // Typing speed
        return () => clearTimeout(timeoutId);
      } else {
        setIsTypingComplete(true);
        
        // Add delay before showing tagline
        const taglineTimeout = setTimeout(() => {
          setShowTagline(true);
          
          // Add delay before showing buttons
          const buttonsTimeout = setTimeout(() => {
            setShowButtons(true);
          }, 700); // Delay before showing buttons after tagline
          
          return () => clearTimeout(buttonsTimeout);
        }, 500); // Delay before showing tagline after typing
        
        return () => clearTimeout(taglineTimeout);
      }
    }
  }, [isLoaded, displayText, fullText]);

  // Handle scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-teal-500 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>
        
        <div className="container relative mx-auto px-4 py-24 md:py-32 max-w-full">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-500">
              {displayText}
              <span className={`inline-block w-1 h-10 bg-teal-400 ml-1 ${isTypingComplete ? 'animate-pulse' : 'animate-blink'}`}></span>
            </h1>
            <p className={`text-xl md:text-2xl mb-10 leading-relaxed transition-all duration-1000 transform ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="font-semibold relative px-4 py-2">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-indigo-300 to-purple-300">Sync with the Pulse of Innovation.</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent animated-gradient-border"></span>
              </span>
            </p>
            <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 transform ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link
                to="/register"
                className="group relative bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Get Started <FiArrowRight className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link
                to="/blogs"
                className="group relative border-2 border-teal-400 text-teal-400 hover:text-white font-bold py-4 px-8 rounded-full overflow-hidden transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Explore Blogs <FiBookOpen className="ml-2" />
                </span>
                <span className="absolute inset-0 w-0 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#f9fafb" className="w-full">
            <path d="M0,0 L1440,0 L1440,30 C1320,70 1200,90 1080,90 C920,90 760,60 600,60 C440,60 280,80 120,80 C80,80 40,70 0,50 L0,0 Z"></path>
          </svg>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <FiSearch size={30} className="text-teal-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">
                Find the content you're looking for
              </h2>
            </div>
            <div className="transform hover:scale-[1.01] transition-transform duration-300">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Blogs */}
      <div className="bg-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-800">Latest Blogs</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Discover the newest ideas, insights and stories from our community of writers</p>
          
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-teal-100 opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-indigo-100 opacity-50 blur-2xl"></div>
            
            <div className="relative">
              <BlogList />
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/blogs"
              className="group inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              View All Blogs
              <FiArrowRight className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-800">
            Explore by Category
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Find content that matches your interests from our wide range of categories</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/blogs?category=${category.name}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`h-3 bg-gradient-to-r ${category.color}`}></div>
                <div className="p-6">
                  <div className="mb-4 text-center">
                    <span className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${category.color} text-white transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">{category.name}</h3>
                  <p className="text-gray-600 text-center">
                    Discover {category.name.toLowerCase()} insights
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-teal-600"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-300 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-teal-300 blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 text-center max-w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to share your story?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-indigo-100">
            Join our community of writers and readers to connect and share your
            ideas with the world.
          </p>
          <Link
            to="/register"
            className="group relative inline-flex items-center bg-white text-indigo-600 hover:text-indigo-700 font-bold py-4 px-8 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Start Writing Today
            <FiArrowRight className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 
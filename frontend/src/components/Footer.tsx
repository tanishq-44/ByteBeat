import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white overflow-hidden">
      {/* Wave separator */}
      <div className="relative w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-current text-white w-full">
          <path d="M0,60 C240,100 480,0 720,30 C960,60 1200,100 1440,80 L1440,0 L0,0 Z" />
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-6">
              <Link to="/" className="text-3xl font-bold flex items-center group">
                <span className="text-teal-400 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 inline-block">B</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">yteBeat</span>
              </Link>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              ByteBeat is where technology and innovation find their rhythm. We decode the digital pulse of tomorrow, bringing you cutting-edge insights, breakthrough technologies, and transformative ideas that shape our future. Stay in sync with what matters.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-teal-400"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/create-blog" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Write a Blog
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              Categories
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-teal-400"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blogs?category=Technology" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=Programming" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Programming
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=Design" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Design
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=Business" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Business
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=Lifestyle" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center">
                  <FiArrowRight className="mr-2 text-xs" />
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-teal-400"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiMapPin className="text-teal-400 mr-3 mt-1" />
                <p className="text-gray-400">123 Blog Street, Content City, BT 10001</p>
              </div>
              <div className="flex items-start">
                <FiMail className="text-teal-400 mr-3 mt-1" />
                <p className="text-gray-400">contact@bytebeat.com</p>
              </div>
              <div className="mt-6">
                <form className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
                  />
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-4 py-2 rounded-r-lg hover:from-teal-600 hover:to-indigo-600 transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-gray-500 text-sm mt-2">Subscribe to our newsletter</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {currentYear} ByteBeat. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-500 hover:text-teal-400 text-sm transition-colors duration-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-teal-400 text-sm transition-colors duration-300">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-teal-400 text-sm transition-colors duration-300">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
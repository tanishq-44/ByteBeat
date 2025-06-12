import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiBookOpen, FiEdit, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-teal-400 font-semibold' : 'text-white hover:text-teal-300';
  };

  // Handle clicking on the current page link to scroll to top
  const handleNavClick = (path: string) => (e: React.MouseEvent) => {
    if (location.pathname === path) {
      e.preventDefault(); // Prevent default navigation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${
        scrolled 
          ? 'bg-gradient-to-r from-gray-900 to-gray-800 py-3 shadow-lg' 
          : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-4'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 max-w-full">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center group"
          onClick={handleNavClick('/')}
        >
          <span className="text-teal-400 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 inline-block">B</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
            yteBeat
          </span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8 items-center">
            <li>
              <Link to="/" onClick={handleNavClick('/')} className={`flex items-center space-x-1 transition-colors duration-200 ${isActive('/')}`}>
                <FiHome className="text-teal-400" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/blogs" onClick={handleNavClick('/blogs')} className={`flex items-center space-x-1 transition-colors duration-200 ${isActive('/blogs')}`}>
                <FiBookOpen className="text-teal-400" />
                <span>Blogs</span>
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/create-blog" onClick={handleNavClick('/create-blog')} className={`flex items-center space-x-1 transition-colors duration-200 ${isActive('/create-blog')}`}>
                    <FiEdit className="text-teal-400" />
                    <span>Write</span>
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/admin" onClick={handleNavClick('/admin')} className={`flex items-center space-x-1 transition-colors duration-200 ${isActive('/admin')}`}>
                      <FiSettings className="text-teal-400" />
                      <span>Admin</span>
                    </Link>
                  </li>
                )}
                <li className="flex items-center pl-4 border-l border-gray-700">
                  <Link 
                    to="/profile" 
                    onClick={handleNavClick('/profile')}
                    className="flex items-center space-x-2 hover:text-teal-300 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-4 flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-1.5 px-3 rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={handleNavClick('/login')}
                    className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={handleNavClick('/register')}
                    className="bg-white text-gray-900 hover:bg-gray-100 py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-900 shadow-lg p-4 md:hidden w-full overflow-hidden">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-white hover:text-teal-300 py-2"
                  onClick={(e) => {
                    handleNavClick('/')(e);
                    setMobileMenuOpen(false);
                  }}
                >
                  <FiHome />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/blogs" 
                  className="flex items-center space-x-2 text-white hover:text-teal-300 py-2"
                  onClick={(e) => {
                    handleNavClick('/blogs')(e);
                    setMobileMenuOpen(false);
                  }}
                >
                  <FiBookOpen />
                  <span>Blogs</span>
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      to="/create-blog" 
                      className="flex items-center space-x-2 text-white hover:text-teal-300 py-2"
                      onClick={(e) => {
                        handleNavClick('/create-blog')(e);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <FiEdit />
                      <span>Write</span>
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link 
                        to="/admin" 
                        className="flex items-center space-x-2 text-white hover:text-teal-300 py-2"
                        onClick={(e) => {
                          handleNavClick('/admin')(e);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FiSettings />
                        <span>Admin</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-white hover:text-teal-300 py-2"
                      onClick={(e) => {
                        handleNavClick('/profile')(e);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <FiUser />
                      <span>{user?.name}</span>
                    </Link>
                  </li>
                  <li className="pt-2 border-t border-gray-700">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="pt-2 border-t border-gray-700">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-indigo-500 text-white py-2 rounded-lg mb-2"
                      onClick={(e) => {
                        handleNavClick('/login')(e);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center bg-white text-gray-900 py-2 rounded-lg"
                      onClick={(e) => {
                        handleNavClick('/register')(e);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
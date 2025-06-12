import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  // This effect runs on route change and will scroll to top
  useEffect(() => {
    // If there's a hash, let the browser handle the scrolling
    if (hash === '') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname, hash, key]); // Added key to ensure this runs even when clicking the same route

  return null;
};

export default ScrollToTop; 
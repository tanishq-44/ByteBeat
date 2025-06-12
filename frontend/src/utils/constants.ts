// Default image URLs
export const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
export const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800&auto=format&fit=crop';

// API Endpoints
export const API_BASE_URL = 'http://localhost:5000/api';

// Categories
export const CATEGORIES = [
  'Technology',
  'Programming',
  'Design',
  'Business',
  'Lifestyle',
  'Health',
  'Other'
];

// Functions
export const getErrorMessage = (error: any): string => {
  return error?.response?.data?.message || error?.message || 'An error occurred';
}; 
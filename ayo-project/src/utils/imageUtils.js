/**
 * Utility function to construct proper image URLs for profile pictures and assets
 * Handles:
 * - Full URLs (http/https) - returned as-is
 * - Relative paths starting with / - prefixed with API base URL
 * - Relative paths without / - prefixed with API base URL + /
 * - Empty/null values - returns default avatar
 */

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/default-avatar.png';
  }

  // If already a full URL, return as-is
  if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
    return imagePath;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  // If path starts with /, concat directly
  if (typeof imagePath === 'string' && imagePath.startsWith('/')) {
    return `${baseURL}${imagePath}`;
  }

  // Otherwise assume it needs a / prefix
  return `${baseURL}/${imagePath}`;
};

export default getImageUrl;

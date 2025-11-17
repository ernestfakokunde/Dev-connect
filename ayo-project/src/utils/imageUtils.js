/**
 * Utility function to construct proper image URLs for profile pictures and assets
 * Handles:
 * - Full URLs (http/https) - returned as-is
 * - Relative paths starting with / - prefixed with API base URL
 * - Relative paths without / - prefixed with API base URL + /
 * - Empty/null values - returns default avatar
 */

const normalizeBaseUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const DEFAULT_AVATAR = '/default-avatar.svg';
export const FALLBACK_POST_IMAGE = 'https://via.placeholder.com/800x600?text=Image+Unavailable';

export const getImageUrl = (imagePath, fallback = DEFAULT_AVATAR) => {
  if (!imagePath) {
    return fallback;
  }

  // If already a full URL, return as-is
  if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
    return imagePath;
  }

  const baseURL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000');

  // If path starts with /, concat directly
  if (typeof imagePath === 'string' && imagePath.startsWith('/')) {
    return `${baseURL}${imagePath}`;
  }

  // Otherwise assume it needs a / prefix
  const cleanedPath = imagePath.replace(/^\/+/, '');
  return `${baseURL}/${cleanedPath}`;
};

export default getImageUrl;

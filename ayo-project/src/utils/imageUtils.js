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

const normalizePath = (value) => {
  if (typeof value !== 'string') return value;
  // replace Windows backslashes with forward slashes
  const withForwardSlashes = value.replace(/\\/g, '/');
  // collapse duplicate slashes while keeping protocol markers intact
  return withForwardSlashes.replace(/([^:])\/{2,}/g, '$1/');
};

export const DEFAULT_AVATAR = '/default-avatar.svg';
export const FALLBACK_POST_IMAGE = 'https://via.placeholder.com/800x600?text=Image+Unavailable';

export const getImageUrl = (imagePath, fallback = DEFAULT_AVATAR) => {
  // Handle null, undefined, empty string, or non-string/non-array values
  if (!imagePath) {
    return fallback;
  }

  // If it's an array, take the first element (for post images that might be arrays)
  let pathToProcess = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  
  // Convert to string if it's not already
  if (typeof pathToProcess !== 'string') {
    pathToProcess = String(pathToProcess);
  }

  // Trim whitespace for more robust matching
  pathToProcess = pathToProcess.trim();

  // Check if empty after trimming
  if (pathToProcess === '') {
    return fallback;
  }

  // If already a full URL (http:// or https://), or data/blob URL, return as-is
  if (/^(https?:)?\/\//i.test(pathToProcess) || /^(data|blob):/i.test(pathToProcess)) {
    return pathToProcess;
  }

  const normalizedPath = normalizePath(pathToProcess);

  // Get base URL from environment variable
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const baseURL = normalizeBaseUrl(apiBase.replace('/api', ''));

  // If path starts with // (protocol-relative), add https:
  if (normalizedPath.startsWith('//')) {
    return `https:${normalizedPath}`;
  }

  // If path starts with /, prepend base URL
  if (normalizedPath.startsWith('/')) {
    return `${baseURL}${normalizedPath}`;
  }

  // Otherwise, add a / between base URL and path
  const cleanedPath = normalizedPath.replace(/^\/+/, '');
  return `${baseURL}/${cleanedPath}`;
};

export default getImageUrl;

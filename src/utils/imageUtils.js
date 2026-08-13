/**
 * Unwraps proxied image URLs back to canonical target URL
 */
export function cleanImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('/api/image-proxy?url=')) {
    try {
      const raw = url.replace('/api/image-proxy?url=', '');
      return decodeURIComponent(raw);
    } catch (e) {
      return url;
    }
  }
  return url;
}

/**
 * Formats image URLs to prevent Mixed Content blocking over HTTPS (Vercel Production)
 * @param {string} url - Image source URL
 * @returns {string} Safe image URL
 */
export function formatImageUrl(url) {
  const cleanUrl = cleanImageUrl(url);
  if (!cleanUrl || typeof cleanUrl !== 'string') return cleanUrl;
  if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // If the image URL is unencrypted HTTP and running over HTTPS (Vercel Production)
  if (cleanUrl.startsWith('http://')) {
    if (
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:' &&
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1')
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(cleanUrl)}`;
    }
  }
  return cleanUrl;
}

export const DEFAULT_PLACEHOLDER_IMAGE = '/images/placeholder_property.webp';

/**
 * Fallback event handler for <img> onError events
 */
export function handleImageError(e) {
  if (e && e.target && e.target.src !== DEFAULT_PLACEHOLDER_IMAGE) {
    e.target.onerror = null;
    e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
  }
}



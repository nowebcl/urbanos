/**
 * Formats image URLs to prevent Mixed Content blocking over HTTPS (Vercel Production)
 * @param {string} url - Image source URL
 * @returns {string} Safe image URL (proxied via /api/image-proxy if needed)
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/api/image-proxy')) {
    return url;
  }

  // If the image URL is unencrypted HTTP and running over HTTPS (Vercel)
  if (url.startsWith('http://')) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
  }

  return url;
}

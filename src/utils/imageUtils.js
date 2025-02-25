// Cache key prefix for failed image URLs
const FAILED_IMAGE_CACHE_PREFIX = 'failed_image_url_';\n
// Cache duration in milliseconds (24 hours)\nconst CACHE_DURATION = 24 * 60 * 60 * 1000;\n
/**
 * Validates if a URL is a valid image URL by checking the cache and optionally making a HEAD request
 * @param {string} url - The URL to validate
 * @returns {Promise<boolean>} - Promise that resolves to true if the URL is valid, false otherwise
 */
export const validateImageUrl = async (url) => {
    if (!url) return false;

    // Check if URL is in the failed images cache
    const cacheKey = FAILED_IMAGE_CACHE_PREFIX + url;
    const cachedResult = localStorage.getItem(cacheKey);
    
    if (cachedResult) {
        const { timestamp, isValid } = JSON.parse(cachedResult);
        // Check if cache is still valid (within 24 hours)
        if (Date.now() - timestamp < CACHE_DURATION) {
            return isValid;
        }
        // Cache expired, remove it
        localStorage.removeItem(cacheKey);
    }

    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        const isValid = response.ok && contentType && contentType.startsWith('image/');
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            isValid
        }));
        
        return isValid;
    } catch (error) {
        // Cache the failure
        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            isValid: false
        }));
        return false;
    }
};

/**
 * Gets the cached validation result for an image URL
 * @param {string} url - The URL to check in cache
 * @returns {boolean|null} - Returns the cached validation result or null if not in cache
 */
export const getCachedImageValidation = (url) => {
    if (!url) return null;
    
    const cacheKey = FAILED_IMAGE_CACHE_PREFIX + url;
    const cachedResult = localStorage.getItem(cacheKey);
    
    if (cachedResult) {
        const { timestamp, isValid } = JSON.parse(cachedResult);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return isValid;
        }
        localStorage.removeItem(cacheKey);
    }
    
    return null;
};
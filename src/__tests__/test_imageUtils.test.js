import { validateImageUrl, getCachedImageValidation } from '../utils/imageUtils';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe('imageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('validateImageUrl', () => {
    it('should return false for null or empty URL', async () => {
      expect(await validateImageUrl(null)).toBe(false);
      expect(await validateImageUrl('')).toBe(false);
      expect(await validateImageUrl(undefined)).toBe(false);
    });

    it('should return cached result if URL is in cache and not expired', async () => {
      const url = 'https://example.com/image.jpg';
      const cachedData = {
        timestamp: Date.now(),
        isValid: true
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      
      const result = await validateImageUrl(url);
      
      expect(result).toBe(true);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should remove expired cache and revalidate URL', async () => {
      const url = 'https://example.com/image.jpg';
      const expiredCache = {
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        isValid: true
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredCache));
      
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          headers: {
            get: () => 'image/jpeg'
          }
        })
      );
      
      await validateImageUrl(url);
      
      expect(localStorageMock.removeItem).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(url, { method: 'HEAD' });
    });

    it('should validate and cache new image URLs', async () => {
      const url = 'https://example.com/image.jpg';
      
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          headers: {
            get: () => 'image/jpeg'
          }
        })
      );
      
      const result = await validateImageUrl(url);
      
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(url, { method: 'HEAD' });
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle and cache failed validations', async () => {
      const url = 'https://example.com/invalid.jpg';
      
      fetch.mockImplementationOnce(() => 
        Promise.reject(new Error('Network error'))
      );
      
      const result = await validateImageUrl(url);
      
      expect(result).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const cachedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(cachedData.isValid).toBe(false);
    });
  });

  describe('getCachedImageValidation', () => {
    it('should return null for null or empty URL', () => {
      expect(getCachedImageValidation(null)).toBeNull();
      expect(getCachedImageValidation('')).toBeNull();
      expect(getCachedImageValidation(undefined)).toBeNull();
    });

    it('should return cached validation result if not expired', () => {
      const url = 'https://example.com/image.jpg';
      const cachedData = {
        timestamp: Date.now(),
        isValid: true
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      
      const result = getCachedImageValidation(url);
      
      expect(result).toBe(true);
    });

    it('should remove expired cache and return null', () => {
      const url = 'https://example.com/image.jpg';
      const expiredCache = {
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        isValid: true
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredCache));
      
      const result = getCachedImageValidation(url);
      
      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });

    it('should return null for non-existent cache entry', () => {
      const url = 'https://example.com/image.jpg';
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = getCachedImageValidation(url);
      
      expect(result).toBeNull();
    });
  });
});
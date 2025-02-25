import { validateImageUrl, getCachedImageValidation } from '../utils/imageUtils';

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: jest.fn(key => localStorageMock.store[key]),
    setItem: jest.fn((key, value) => localStorageMock.store[key] = value),
    removeItem: jest.fn(key => delete localStorageMock.store[key]),
    clear: jest.fn(() => localStorageMock.store = {})
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe('imageUtils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
    });

    describe('validateImageUrl', () => {
        it('should return false for null or empty URLs', async () => {
            expect(await validateImageUrl(null)).toBe(false);
            expect(await validateImageUrl('')).toBe(false);
        });

        it('should return true for valid image URLs', async () => {
            global.fetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                headers: {
                    get: () => 'image/jpeg'
                }
            }));

            const result = await validateImageUrl('https://example.com/image.jpg');
            expect(result).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalled();
        });

        it('should return false for invalid image URLs', async () => {
            global.fetch.mockImplementationOnce(() => Promise.resolve({
                ok: false,
                headers: {
                    get: () => 'text/html'
                }
            }));

            const result = await validateImageUrl('https://example.com/not-an-image');
            expect(result).toBe(false);
            expect(localStorage.setItem).toHaveBeenCalled();
        });

        it('should return false and cache the result on network errors', async () => {
            global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

            const result = await validateImageUrl('https://example.com/error');
            expect(result).toBe(false);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe('getCachedImageValidation', () => {
        it('should return null for null or empty URLs', () => {
            expect(getCachedImageValidation(null)).toBeNull();
            expect(getCachedImageValidation('')).toBeNull();
        });

        it('should return cached validation result if within cache duration', () => {
            const url = 'https://example.com/image.jpg';
            const cachedData = {
                timestamp: Date.now(),
                isValid: true
            };
            localStorage.setItem(`failed_image_url_${url}`, JSON.stringify(cachedData));

            const result = getCachedImageValidation(url);
            expect(result).toBe(true);
        });

        it('should return null and remove expired cache entries', () => {
            const url = 'https://example.com/image.jpg';
            const cachedData = {
                timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
                isValid: true
            };
            localStorage.setItem(`failed_image_url_${url}`, JSON.stringify(cachedData));

            const result = getCachedImageValidation(url);
            expect(result).toBeNull();
            expect(localStorage.removeItem).toHaveBeenCalled();
        });
    });
});
import { API_CONFIG, replaceUrlParams } from '../config/api.config';

describe('API Configuration Tests', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('Default Configuration Tests', () => {
        test('should use default values when environment variables are not set', () => {
            expect(API_CONFIG.BASE_URL).toBe('http://localhost:3000/api');
            expect(API_CONFIG.TIMEOUT).toBe(30000);
            expect(API_CONFIG.VERSION).toBe('v1');
            expect(API_CONFIG.RETRY.attempts).toBe(3);
        });
    });

    describe('Custom Environment Variable Tests', () => {
        test('should use custom values when environment variables are provided', () => {
            process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
            process.env.REACT_APP_API_TIMEOUT = '60000';
            process.env.REACT_APP_API_VERSION = 'v2';
            process.env.REACT_APP_API_RETRY_ATTEMPTS = '5';

            // Re-import the module to get fresh config with new env vars
            jest.isolateModules(() => {
                const { API_CONFIG } = require('../config/api.config');
                expect(API_CONFIG.BASE_URL).toBe('https://api.example.com');
                expect(API_CONFIG.TIMEOUT).toBe(60000);
                expect(API_CONFIG.VERSION).toBe('v2');
                expect(API_CONFIG.RETRY.attempts).toBe(5);
            });
        });
    });

    describe('Error Handling Tests', () => {
        test('should handle invalid timeout value gracefully', () => {
            process.env.REACT_APP_API_TIMEOUT = 'invalid';
            
            jest.isolateModules(() => {
                const { API_CONFIG } = require('../config/api.config');
                expect(API_CONFIG.TIMEOUT).toBe(30000); // Should fall back to default
            });
        });

        test('should handle invalid retry attempts value gracefully', () => {
            process.env.REACT_APP_API_RETRY_ATTEMPTS = 'invalid';
            
            jest.isolateModules(() => {
                const { API_CONFIG } = require('../config/api.config');
                expect(API_CONFIG.RETRY.attempts).toBe(3); // Should fall back to default
            });
        });
    });

    describe('URL Parameter Replacement Tests', () => {
        test('should correctly replace URL parameters', () => {
            const url = '/products/:id';
            const params = { id: '123' };
            expect(replaceUrlParams(url, params)).toBe('/products/123');
        });

        test('should throw error for missing parameters', () => {
            const url = '/products/:id';
            expect(() => replaceUrlParams(url, {})).toThrow('Missing required URL parameters: id');
        });

        test('should throw error for invalid parameter values', () => {
            const url = '/products/:id';
            const params = { id: null };
            expect(() => replaceUrlParams(url, params)).toThrow("Invalid value for parameter 'id'");
        });
    });
});
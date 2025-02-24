/**
 * API Configuration for Products-API-L integration
 * This module provides configuration settings and utilities for interacting with the Products API.
 */


// Environment variable configuration with default values
const DEFAULT_CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    API_TIMEOUT: 30000, // 30 seconds
    API_VERSION: 'v1',
    RETRY_ATTEMPTS: 3
};

/**
 * Main API configuration object
 * @type {Object}
 */
export const API_CONFIG = {
    // Base URL with environment variable support and validation
    BASE_URL: (() => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL;
        if (!baseUrl) {
            console.warn('API Base URL is not configured. Using default:', DEFAULT_CONFIG.API_BASE_URL);
        }
        return baseUrl;
    })(),

    // API timeout configuration
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || DEFAULT_CONFIG.API_TIMEOUT,

    // API version configuration
    VERSION: process.env.REACT_APP_API_VERSION || DEFAULT_CONFIG.API_VERSION,

    // Retry configuration
    RETRY: {
        attempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || DEFAULT_CONFIG.RETRY_ATTEMPTS
    },

    // API endpoints configuration
    ENDPOINTS: {
        PRODUCTS: {
            LIST: '/products',
            DETAIL: '/products/:id',
            CREATE: '/products',
            UPDATE: '/products/:id',
            DELETE: '/products/:id'
        }
    },

    // Default headers configuration
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Helper function to replace URL parameters
 * @param {string} url - The URL template with parameters (e.g., '/products/:id')
 * @param {Object} params - An object containing parameter values to replace
 * @returns {string} The URL with replaced parameters
 * @throws {Error} If required parameters are missing or invalid
 */
export const replaceUrlParams = (url, params) => {
    if (!url) {
        throw new Error('URL is required');
    }

    let finalUrl = url;
    
    if (params) {
        // Find all required parameters in the URL
        const requiredParams = url.match(/:[a-zA-Z]+/g) || [];
        
        // Validate that all required parameters are provided
        const missingParams = requiredParams
            .map(param => param.substring(1))
            .filter(param => !params[param]);

        if (missingParams.length > 0) {
            throw new Error(`Missing required URL parameters: ${missingParams.join(', ')}`);
        }

        // Replace parameters in the URL
        Object.keys(params).forEach(key => {
            const paramValue = params[key];
            if (paramValue === undefined || paramValue === null) {
                throw new Error(`Invalid value for parameter '${key}'`);
            }
            finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(paramValue));
        });
    }

    return finalUrl;
};

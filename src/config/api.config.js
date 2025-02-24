// API Configuration for Products-API-L integration

export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
    ENDPOINTS: {
        PRODUCTS: {
            LIST: '/products',
            DETAIL: '/products/:id',
            CREATE: '/products',
            UPDATE: '/products/:id',
            DELETE: '/products/:id'
        }
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Helper function to replace URL parameters
export const replaceUrlParams = (url, params) => {
    let finalUrl = url;
    if (params) {
        Object.keys(params).forEach(key => {
            finalUrl = finalUrl.replace(`:${key}`, params[key]);
        });
    }
    return finalUrl;
};
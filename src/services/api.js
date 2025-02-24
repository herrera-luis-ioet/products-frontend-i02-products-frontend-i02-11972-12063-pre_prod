import axios from 'axios';
import { API_CONFIG, replaceUrlParams } from '../config/api.config';

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: API_CONFIG.HEADERS,
    timeout: 10000 // 10 seconds timeout
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
    config => {
        // You can add auth tokens here if needed
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
    response => response,
    error => {
        // Handle errors globally
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Products API service
export const ProductsAPI = {
    // Get all products
    getAllProducts: async () => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.PRODUCTS.LIST);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get product by ID
    getProduct: async (id) => {
        try {
            const url = replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL, { id });
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new product
    createProduct: async (productData) => {
        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.PRODUCTS.CREATE,
                productData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update product
    updateProduct: async (id, productData) => {
        try {
            const url = replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE, { id });
            const response = await apiClient.put(url, productData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (id) => {
        try {
            const url = replaceUrlParams(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE, { id });
            const response = await apiClient.delete(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
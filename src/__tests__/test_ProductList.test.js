import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductsAPI } from '../services/api';
import ProductList from '../components/ProductList/ProductList';

// Mock the API module
jest.mock('../services/api');

describe('ProductList Component', () => {
    const mockProducts = [
        {
            id: 1,
            name: 'Product 1',
            description: 'Description 1',
            price: 99.99,
            image: 'image1.jpg'
        },
        {
            id: 2,
            name: 'Product 2',
            description: 'Description 2',
            price: 149.99,
            image: 'image2.jpg'
        }
    ];

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('displays loading state initially', () => {
        ProductsAPI.getAllProducts.mockImplementation(() => new Promise(() => {}));
        render(<ProductList />);
        
        expect(screen.getByRole('alert')).toHaveTextContent('Loading products...');
        expect(screen.getByRole('alert')).toHaveAttribute('aria-busy', 'true');
    });

    test('renders products successfully', async () => {
        ProductsAPI.getAllProducts.mockResolvedValue(mockProducts);
        render(<ProductList />);
        
        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        
        // Verify products are rendered
        mockProducts.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByText(product.description)).toBeInTheDocument();
            expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
        });
    });

    test('handles API error correctly', async () => {
        const errorMessage = 'Failed to load products. Please try again later.';
        ProductsAPI.getAllProducts.mockRejectedValue(new Error('API Error'));
        
        render(<ProductList />);
        
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
        });
        
        // Verify error is logged
        expect(console.error).toHaveBeenCalled;
    });

    test('displays empty state when no products', async () => {
        ProductsAPI.getAllProducts.mockResolvedValue([]);
        render(<ProductList />);
        
        await waitFor(() => {
            expect(screen.getByText('No products available.')).toBeInTheDocument();
        });
    });

    test('has correct accessibility attributes', async () => {
        ProductsAPI.getAllProducts.mockResolvedValue(mockProducts);
        render(<ProductList />);
        
        await waitFor(() => {
            const section = screen.getByRole('region', { name: /product list/i });
            expect(section).toBeInTheDocument();
        });
    });

    test('integrates with ProductCard component', async () => {
        ProductsAPI.getAllProducts.mockResolvedValue(mockProducts);
        render(<ProductList />);
        
        await waitFor(() => {
            // Verify ProductCard components are rendered with correct props
            mockProducts.forEach(product => {
                const article = screen.getByRole('article', { name: `Product: ${product.name}` });
                expect(article).toBeInTheDocument();
            });
        });
    });
});
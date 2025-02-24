import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductsAPI } from '../services/api';
import ProductList from '../components/ProductList/ProductList';

// Mock the API module
jest.mock('../services/api');

// Mock console.error to prevent test output pollution
const originalError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalError;
});

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

    describe('Data Validation', () => {
        test('handles invalid product data format', async () => {
            const invalidProducts = [
                { id: 1 }, // Missing required fields
                { name: 'Invalid', price: 'not-a-number' }, // Invalid price type
                { id: 2, name: 123, price: -10 }, // Invalid name type and negative price
                null, // Null product
                undefined, // Undefined product
                'not-an-object' // Not an object
            ];
            
            ProductsAPI.getAllProducts.mockResolvedValue(invalidProducts);
            render(<ProductList />);
            
            await waitFor(() => {
                expect(screen.getByText('No products available.')).toBeInTheDocument();
            });
        });

        test('filters out invalid products while keeping valid ones', async () => {
            const mixedProducts = [
                { id: 1, name: 'Valid Product', price: 99.99 }, // Valid
                { id: 2 }, // Invalid - missing fields
                { id: 3, name: 'Another Valid', price: 149.99 }, // Valid
                { name: 'Invalid', price: 'wrong' } // Invalid - missing id
            ];
            
            ProductsAPI.getAllProducts.mockResolvedValue(mixedProducts);
            render(<ProductList />);
            
            await waitFor(() => {
                expect(screen.getByText('Valid Product')).toBeInTheDocument();
                expect(screen.getByText('Another Valid')).toBeInTheDocument();
                expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
            });
        });
    });

    describe('API Error Handling', () => {
        test('handles non-array API response', async () => {
            ProductsAPI.getAllProducts.mockResolvedValue({ error: 'Invalid format' });
            render(<ProductList />);
            
            await waitFor(() => {
                expect(screen.getByRole('alert')).toHaveTextContent('Failed to load products');
            });
        });

        test('handles network timeout', async () => {
            ProductsAPI.getAllProducts.mockRejectedValue(new Error('Network timeout'));
            render(<ProductList />);
            
            await waitFor(() => {
                expect(screen.getByRole('alert')).toHaveTextContent('Failed to load products');
                expect(console.error).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
            });
        });

        test('handles server error response', async () => {
            ProductsAPI.getAllProducts.mockRejectedValue(new Error('500 Internal Server Error'));
            render(<ProductList />);
            
            await waitFor(() => {
                expect(screen.getByRole('alert')).toHaveTextContent('Failed to load products');
                expect(console.error).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
            });
        });
    });

    describe('Edge Cases', () => {
        test('handles products with minimum valid data', async () => {
            const minimalProducts = [
                { id: 1, name: 'Minimal', price: 0 }, // Minimum price
                { id: '2', name: '', price: 0.01 } // String ID and empty name
            ];
            
            ProductsAPI.getAllProducts.mockResolvedValue(minimalProducts);
            render(<ProductList />);
            
            await waitFor(() => {
                expect(screen.getByText('Minimal')).toBeInTheDocument();
                expect(screen.getByText('$0.00')).toBeInTheDocument();
                expect(screen.getByText('$0.01')).toBeInTheDocument();
            });
        });

        test('handles extremely large product datasets', async () => {
            const largeProductSet = Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                name: `Product ${i + 1}`,
                price: 99.99
            }));
            
            ProductsAPI.getAllProducts.mockResolvedValue(largeProductSet);
            render(<ProductList />);
            
            await waitFor(() => {
                expect(screen.getAllByRole('article')).toHaveLength(100);
            });
        });
    });
});

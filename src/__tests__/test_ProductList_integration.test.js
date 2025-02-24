import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../components/ProductList/ProductList';
import { ProductsAPI } from '../services/api';

// Mock the API module
jest.mock('../services/api');

describe('ProductList Integration Tests', () => {
    const mockProducts = [
        {
            id: 1,
            name: 'Test Product 1',
            description: 'Description 1',
            price: 19.99,
            image: 'test1.jpg'
        },
        {
            id: 2,
            name: 'Test Product 2',
            description: 'Description 2',
            price: 29.99,
            image: 'test2.jpg'
        }
    ];

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('renders correct number of ProductCard components', async () => {
        // Arrange
        ProductsAPI.getAllProducts.mockResolvedValue(mockProducts);

        // Act
        render(<ProductList />);

        // Assert
        await waitFor(() => {
            const productCards = screen.getAllByRole('article');
            expect(productCards).toHaveLength(mockProducts.length);
        });
    });

    test('correctly propagates data from ProductList to ProductCard components', async () => {
        // Arrange
        ProductsAPI.getAllProducts.mockResolvedValue(mockProducts);

        // Act
        render(<ProductList />);

        // Assert
        await waitFor(() => {
            mockProducts.forEach(product => {
                expect(screen.getByText(product.name)).toBeInTheDocument();
                expect(screen.getByText(product.description)).toBeInTheDocument();
                expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
            });
        });
    });

    test('handles error state across component boundaries', async () => {
        // Arrange
        const errorMessage = 'Failed to load products. Please try again later.';
        ProductsAPI.getAllProducts.mockRejectedValue(new Error('API Error'));

        // Act
        render(<ProductList />);

        // Assert
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
            expect(screen.queryByRole('article')).not.toBeInTheDocument();
        });
    });

    test('displays loading state before rendering ProductCards', async () => {
        // Arrange
        ProductsAPI.getAllProducts.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve(mockProducts), 100))
        );

        // Act
        render(<ProductList />);

        // Assert
        expect(screen.getByRole('alert')).toHaveTextContent('Loading products...');
        expect(screen.getByRole('alert')).toHaveAttribute('aria-busy', 'true');

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
            expect(screen.getAllByRole('article')).toHaveLength(mockProducts.length);
        });
    });

    test('maintains accessibility in component hierarchy', async () => {
        // Arrange
        ProductsAPI.getAllProducts.mockResolvedValue(mockProducts);

        // Act
        render(<ProductList />);

        // Assert
        await waitFor(() => {
            // Check ProductList accessibility
            const productList = screen.getByRole('region', { name: /product list/i });
            expect(productList).toBeInTheDocument();

            // Check ProductCard accessibility
            const productCards = screen.getAllByRole('article');
            productCards.forEach((card, index) => {
                expect(card).toHaveAttribute('aria-label', `Product: ${mockProducts[index].name}`);
                expect(card.querySelector('.product-card__price'))
                    .toHaveAttribute('aria-label', `Price: ${mockProducts[index].price.toFixed(2)}`);
            });
        });
    });

    test('handles invalid data gracefully across components', async () => {
        // Arrange
        const invalidProducts = [
            { id: 1 }, // Missing required fields
            { name: 'Invalid Product', price: 'not a number' }, // Invalid price
            ...mockProducts // Valid products
        ];
        ProductsAPI.getAllProducts.mockResolvedValue(invalidProducts);

        // Act
        render(<ProductList />);

        // Assert
        await waitFor(() => {
            // Should only render valid products
            const productCards = screen.getAllByRole('article');
            expect(productCards).toHaveLength(mockProducts.length);

            // Verify only valid products are displayed
            mockProducts.forEach(product => {
                expect(screen.getByText(product.name)).toBeInTheDocument();
            });
        });
    });
});
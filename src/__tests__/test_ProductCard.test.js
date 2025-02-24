import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard/ProductCard';

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        image: 'test-image.jpg'
    };

    // Test case: Rendering with complete product data
    test('renders product information correctly', () => {
        render(<ProductCard product={mockProduct} />);
        
        // Test product name
        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
        
        // Test product description
        expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
        
        // Test price formatting
        expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
        
        // Test image rendering
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', mockProduct.image);
        expect(image).toHaveAttribute('alt', mockProduct.name);
    });

    // Test case: Handling missing or partial data
    test('handles missing or partial data with fallback values', () => {
        const partialProduct = {
            id: 2
        };
        
        render(<ProductCard product={partialProduct} />);
        
        // Check fallback values
        expect(screen.getByText('Product Name Unavailable')).toBeInTheDocument();
        expect(screen.getByText('No description available')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', '/placeholder-image.jpg');
    });

    // Test case: Image loading error handling
    test('handles image loading errors', () => {
        render(<ProductCard product={mockProduct} />);
        
        const image = screen.getByRole('img');
        
        // Simulate image loading error
        fireEvent.error(image);
        
        // Check if fallback image and alt text are set
        expect(image).toHaveAttribute('src', '/placeholder-image.jpg');
        expect(image).toHaveAttribute('alt', 'Product image not available');
    });

    // Test case: Price formatting validation
    test('handles various price formats correctly', () => {
        // Test with non-numeric price
        const productWithStringPrice = { ...mockProduct, price: 'invalid' };
        render(<ProductCard product={productWithStringPrice} />);
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        
        // Test with zero price
        const productWithZeroPrice = { ...mockProduct, price: 0 };
        render(<ProductCard product={productWithZeroPrice} />);
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        
        // Test with decimal price
        const productWithDecimalPrice = { ...mockProduct, price: 99.9 };
        render(<ProductCard product={productWithDecimalPrice} />);
        expect(screen.getByText('$99.90')).toBeInTheDocument();
    });

    // Test case: PropTypes validation
    test('renders without crashing when no product prop is provided', () => {
        // Suppress prop type validation error in test
        const originalError = console.error;
        console.error = jest.fn();
        
        expect(() => render(<ProductCard />)).not.toThrow();
        
        // Verify that PropTypes warning was logged
        expect(console.error).toHaveBeenCalled();
        
        // Restore console.error
        console.error = originalError;
    });

    // Test case: Accessibility features
    test('has correct accessibility attributes', () => {
        render(<ProductCard product={mockProduct} />);
        
        // Test article role and aria-label
        const article = screen.getByRole('article');
        expect(article).toHaveAttribute('aria-label', `Product: ${mockProduct.name}`);
        
        // Test price aria-label
        const price = screen.getByLabelText(`Price: ${mockProduct.price.toFixed(2)}`);
        expect(price).toBeInTheDocument();
        
        // Test image alt text
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt', mockProduct.name);
        
        // Test lazy loading
        expect(image).toHaveAttribute('loading', 'lazy');
    });

    test('applies correct CSS classes', () => {
        render(<ProductCard product={mockProduct} />);
        
        expect(screen.getByRole('article')).toHaveClass('product-card');
        expect(screen.getByText(mockProduct.name)).toHaveClass('product-card__title');
        expect(screen.getByText(mockProduct.description)).toHaveClass('product-card__description');
        expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toHaveClass('product-card__price');
        expect(screen.getByRole('img')).toHaveClass('product-card__image');
    });
});
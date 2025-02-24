import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard/ProductCard';

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        image: 'test-image.jpg'
    };

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

    test('handles missing image gracefully', () => {
        const productWithoutImage = { ...mockProduct, image: null };
        render(<ProductCard product={productWithoutImage} />);
        
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    test('has correct accessibility attributes', () => {
        render(<ProductCard product={mockProduct} />);
        
        // Test article role and aria-label
        const article = screen.getByRole('article');
        expect(article).toHaveAttribute('aria-label', `Product: ${mockProduct.name}`);
        
        // Test price aria-label
        const price = screen.getByLabelText(`Price: ${mockProduct.price}`);
        expect(price).toBeInTheDocument();
    });

    test('applies correct CSS classes', () => {
        render(<ProductCard product={mockProduct} />);
        
        expect(screen.getByRole('article')).toHaveClass('product-card');
        expect(screen.getByText(mockProduct.name)).toHaveClass('product-card__title');
        expect(screen.getByText(mockProduct.description)).toHaveClass('product-card__description');
        expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toHaveClass('product-card__price');
    });
});
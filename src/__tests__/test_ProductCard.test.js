import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ProductCard from '../components/ProductCard/ProductCard';
import { validateImageUrl, getCachedImageValidation } from '../utils/imageUtils';

// Mock the imageUtils functions
jest.mock('../utils/imageUtils', () => ({
  validateImageUrl: jest.fn(),
  getCachedImageValidation: jest.fn()
}));

describe('ProductCard', () => {
  const mockProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    image: 'https://example.com/test.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with valid product data', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders with fallback values when product data is missing', () => {
    render(<ProductCard product={{}} />);
    
    expect(screen.getByText('Product Name Unavailable')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('handles null product prop gracefully', () => {
    render(<ProductCard product={null} />);
    
    expect(screen.getByText('Product Name Unavailable')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('uses placeholder image when image URL is invalid (cached result)', async () => {
    getCachedImageValidation.mockReturnValue(false);
    
    render(<ProductCard product={mockProduct} />);
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img.src).toContain('placeholder-image.jpg');
    });
  });

  it('validates and uses actual image when URL is valid', async () => {
    getCachedImageValidation.mockReturnValue(null);
    validateImageUrl.mockResolvedValue(true);
    
    render(<ProductCard product={mockProduct} />);
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img.src).toBe(mockProduct.image);
    });
  });

  it('falls back to placeholder when image validation fails', async () => {
    getCachedImageValidation.mockReturnValue(null);
    validateImageUrl.mockResolvedValue(false);
    
    render(<ProductCard product={mockProduct} />);
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img.src).toContain('placeholder-image.jpg');
    });
  });

  it('uses placeholder image immediately when image prop is placeholder-image.jpg', async () => {
    const productWithPlaceholder = {
      ...mockProduct,
      image: '/placeholder-image.jpg'
    };
    
    render(<ProductCard product={productWithPlaceholder} />);
    
    const img = screen.getByRole('img');
    expect(img.src).toContain('placeholder-image.jpg');
    expect(validateImageUrl).not.toHaveBeenCalled();
  });

  it('handles image load errors by falling back to placeholder', async () => {
    getCachedImageValidation.mockReturnValue(null);
    validateImageUrl.mockResolvedValue(true);
    
    render(<ProductCard product={mockProduct} />);
    
    const img = screen.getByRole('img');
    await act(async () => {
      img.dispatchEvent(new Event('error'));
    });
    
    expect(img.src).toContain('placeholder-image.jpg');
    expect(img.alt).toBe('Product image not available');
  });

  it('formats price correctly for different numeric values', () => {
    const testCases = [
      { price: 10, expected: '$10.00' },
      { price: 10.1, expected: '$10.10' },
      { price: 10.99, expected: '$10.99' },
      { price: 0, expected: '$0.00' }
    ];

    testCases.forEach(({ price, expected }) => {
      const { container } = render(
        <ProductCard product={{ ...mockProduct, price }} />
      );
      expect(screen.getByText(expected)).toBeInTheDocument();
      cleanup();
    });
  });

  it('maintains accessibility attributes', () => {
    render(<ProductCard product={mockProduct} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', 'Product: Test Product');
    
    const price = screen.getByText('$99.99');
    expect(price).toHaveAttribute('aria-label', 'Price: 99.99');
  });
});
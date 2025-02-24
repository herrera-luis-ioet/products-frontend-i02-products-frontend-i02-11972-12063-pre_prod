import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProductsAPI } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const validateProduct = (product) => {
    return product &&
        typeof product === 'object' &&
        product.id &&
        typeof product.name === 'string' &&
        typeof product.price === 'number' &&
        product.price >= 0;
};

// PUBLIC_INTERFACE
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await ProductsAPI.getAllProducts();
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format received from API');
            }
            const validProducts = data.filter(validateProduct);
            if (validProducts.length === 0 && data.length > 0) {
                setError('No valid products found in the data');
            }
            setProducts(validProducts);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again later.');
            console.error('Error fetching products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="product-list__loading" role="alert" aria-busy="true">
                Loading products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-list__error" role="alert">
                {error}
            </div>
        );
    }

    return (
        <section className="product-list" aria-label="Product list">
            <div className="product-list__grid">
                {products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product}
                    />
                ))}
            </div>
            {products.length === 0 && (
                <div className="product-list__empty" role="alert">
                    No products available.
                </div>
            )}
        </section>
    );
};

ProductList.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            description: PropTypes.string,
            image: PropTypes.string
        })
    )
};

export default ProductList;

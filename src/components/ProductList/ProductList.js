import React, { useState, useEffect } from 'react';
import { ProductsAPI } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

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
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again later.');
            console.error('Error fetching products:', err);
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

export default ProductList;
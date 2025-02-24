import React from 'react';
import PropTypes from 'prop-types';
import './ProductCard.css';

// PUBLIC_INTERFACE
const ProductCard = ({ product }) => {
    // Fallback values for missing data
    const {
        name = 'Product Name Unavailable',
        description = 'No description available',
        price = 0,
        image = '/placeholder-image.jpg'
    } = product || {};

    // Format price with 2 decimal places and handle non-numeric values
    const formattedPrice = typeof price === 'number' ? price.toFixed(2) : '0.00';

    return (
        <article className="product-card" role="article" aria-label={`Product: ${name}`}>
            <div className="product-card__image-container">
                <img 
                    src={image} 
                    alt={name} 
                    className="product-card__image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                        e.target.alt = 'Product image not available';
                    }}
                />
            </div>
            <div className="product-card__content">
                <h3 className="product-card__title">{name}</h3>
                <p className="product-card__description">{description}</p>
                <p className="product-card__price" aria-label={`Price: ${formattedPrice}`}>
                    ${formattedPrice}
                </p>
            </div>
        </article>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
        image: PropTypes.string,
    }).isRequired,
};

export default ProductCard;

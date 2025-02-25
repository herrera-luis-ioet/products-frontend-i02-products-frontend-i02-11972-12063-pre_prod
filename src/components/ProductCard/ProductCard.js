import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateImageUrl, getCachedImageValidation } from '../../utils/imageUtils';
import './ProductCard.css';

// PUBLIC_INTERFACE
const ProductCard = ({ product }) => {
    const [imageUrl, setImageUrl] = useState('/placeholder-image.jpg');
    
    // Fallback values for missing data
    const {
        name = 'Product Name Unavailable',
        description = 'No description available',
        price = 0,
        image = '/placeholder-image.jpg'
    } = product || {};

    // Format price with 2 decimal places and handle non-numeric values
    const formattedPrice = typeof price === 'number' ? price.toFixed(2) : '0.00';

    useEffect(() => {
        const validateAndSetImage = async () => {
            if (image === '/placeholder-image.jpg') {
                setImageUrl('/placeholder-image.jpg');
                return;
            }

            // Check cache first
            const cachedResult = getCachedImageValidation(image);
            if (cachedResult === false) {
                setImageUrl('/placeholder-image.jpg');
                return;
            }

            // If not in cache or cache is valid, validate the URL
            const isValid = await validateImageUrl(image);
            setImageUrl(isValid ? image : '/placeholder-image.jpg');
        };

        validateAndSetImage();
    }, [image]);

    return (
        <article className="product-card" role="article" aria-label={`Product: ${name}`}>
            <div className="product-card__image-container">
                <img 
                    src={imageUrl} 
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

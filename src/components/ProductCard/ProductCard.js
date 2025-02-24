import React from 'react';
import './ProductCard.css';

// PUBLIC_INTERFACE
const ProductCard = ({ product }) => {
    const { name, description, price, image } = product;

    return (
        <article className="product-card" role="article" aria-label={`Product: ${name}`}>
            <div className="product-card__image-container">
                {image && (
                    <img 
                        src={image} 
                        alt={name} 
                        className="product-card__image"
                        loading="lazy"
                    />
                )}
            </div>
            <div className="product-card__content">
                <h3 className="product-card__title">{name}</h3>
                <p className="product-card__description">{description}</p>
                <p className="product-card__price" aria-label={`Price: ${price}`}>
                    ${price.toFixed(2)}
                </p>
            </div>
        </article>
    );
};

export default ProductCard;
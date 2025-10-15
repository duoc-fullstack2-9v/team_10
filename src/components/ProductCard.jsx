function ProductCard({ 
  image, 
  name, 
  price, 
  alt,
  stock,
  description,
  showStock = false,
  showDescription = false,
  onAddToCart 
}) {
  return (
    <div className="product-card">
      <img 
        src={image} 
        height="200" 
        alt={alt || name} 
        className="product-image" 
      />
      <h3 className="product-name">{name}</h3>
      <p className="product-price">{price}</p>
      {showStock && stock && (
        <p className="product-stock">Stock: {stock}</p>
      )}
      {showDescription && description && (
        <p className="product-desc">{description}</p>
      )}
      <a 
        href="#" 
        className="add-to-cart-button"
        onClick={(e) => {
          e.preventDefault();
          if (onAddToCart) {
            onAddToCart({ image, name, price, alt, stock, description });
          }
        }}
      >
        Agregar al Carrito
      </a>
    </div>
  );
}

export default ProductCard;
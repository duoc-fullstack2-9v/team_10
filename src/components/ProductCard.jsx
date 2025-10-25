import { Link } from 'react-router-dom';

function ProductCard({ 
  id,
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
      <Link to={`/producto/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img 
          src={image} 
          height="200" 
          alt={alt || name} 
          className="product-image" 
        />
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price}</p>
      </Link>
      
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
            onAddToCart({ id, image, name, price, alt, stock, description });
          }
        }}
        style={{
          width: '100%',
          textAlign: 'center',
          marginTop: '10px'
        }}
      >
        Agregar al Carrito
      </a>
    </div>
  );
}

export default ProductCard;
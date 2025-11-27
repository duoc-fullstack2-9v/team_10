import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function ProductCard({ 
  product,
  // Props legacy para compatibilidad
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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Usar product si está disponible, sino usar props individuales
  const productData = product || { 
    idProducto: alt || name,
    linkImagen: image,
    nombre: name, 
    precio: typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price,
    stock: stock || 10,
    descripcion: description
  };

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    if (newQty > productData.stock) return;
    setQuantity(newQty);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAdding(true);
    
    addToCart(productData, quantity);
    
    setTimeout(() => {
      setAdding(false);
      setQuantity(1);
    }, 600);
  };

  const handleCardClick = () => {
    if (product && product.idProducto) {
      navigate(`/productos/${product.idProducto}`);
    }
  };

  return (
    <div 
      className="product-card" 
      onClick={handleCardClick}
      style={{ cursor: product ? 'pointer' : 'default' }}
    >
      <img 
        src={productData.linkImagen || image} 
        height="200" 
        alt={alt || productData.nombre} 
        className="product-image"
        onError={(e) => {
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="80" text-anchor="middle" dy=".3em"%3E🌱%3C/text%3E%3C/svg%3E';
        }}
      />
      <h3 className="product-name">{productData.nombre}</h3>
      <p className="product-price">
        ${typeof productData.precio === 'number' ? productData.precio.toLocaleString('es-CL') : price}
        {productData.unidadMedida && <span style={{ fontSize: '0.85em', color: '#666' }}> {productData.unidadMedida}</span>}
      </p>
      {(showStock || product) && productData.stock !== undefined && (
        <p className="product-stock" style={{ 
          color: productData.stock > 0 ? '#27ae60' : '#e74c3c',
          fontWeight: 'bold'
        }}>
          {productData.stock > 0 ? `Stock: ${productData.stock}` : 'Sin stock'}
        </p>
      )}
      {showDescription && productData.descripcion && (
        <p className="product-desc">{productData.descripcion}</p>
      )}
      
      {/* Selector de cantidad y botón agregar */}
      {productData.stock > 0 && (
        <div style={{ marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(quantity - 1);
              }}
              disabled={quantity <= 1}
              style={{
                width: '30px',
                height: '30px',
                fontSize: '1.2em',
                backgroundColor: quantity <= 1 ? '#e0e0e0' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                lineHeight: '1'
              }}
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                e.stopPropagation();
                handleQuantityChange(parseInt(e.target.value) || 1);
              }}
              onClick={(e) => e.stopPropagation()}
              min="1"
              max={productData.stock}
              style={{
                width: '50px',
                padding: '5px',
                textAlign: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1em',
                height: '30px'
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(quantity + 1);
              }}
              disabled={quantity >= productData.stock}
              style={{
                width: '30px',
                height: '30px',
                fontSize: '1.2em',
                backgroundColor: quantity >= productData.stock ? '#e0e0e0' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: quantity >= productData.stock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                lineHeight: '1'
              }}
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="add-to-cart-button"
            style={{
              width: '100%',
              opacity: adding ? 0.7 : 1,
              cursor: adding ? 'not-allowed' : 'pointer',
              backgroundColor: adding ? '#95a5a6' : undefined
            }}
          >
            {adding ? '✓ Agregado' : '🛒 Agregar al Carrito'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
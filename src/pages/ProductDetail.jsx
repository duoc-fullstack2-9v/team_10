import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import ProductoService from '../services/producto.service';
import Toast from '../components/Toast';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await ProductoService.obtenerProducto(id);
      setProduct(productData);
      setError('');
    } catch (err) {
      console.error('Error cargando producto:', err);
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCart(product, quantity);
    
    setTimeout(() => {
      setAddingToCart(false);
      setToast({ 
        message: `${quantity} ${product.nombre}${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito`, 
        type: 'success' 
      });
    }, 500);
  };

  const getCategoryBadgeColor = (idCategoria) => {
    const colors = {
      1: '#e74c3c',  // Frutas - Rojo
      2: '#27ae60',  // Verduras - Verde
      3: '#3498db',  // Otros - Azul
      4: '#9b59b6'   // Hierbas - Púrpura
    };
    return colors[idCategoria] || '#95a5a6';
  };

  const getCategoryName = (idCategoria) => {
    const categories = {
      1: 'Frutas',
      2: 'Verduras',
      3: 'Otros',
      4: 'Hierbas'
    };
    return categories[idCategoria] || 'Sin categoría';
  };

  if (loading) {
    return (
      <main style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #27ae60',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Cargando producto...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>😕 {error || 'Producto no encontrado'}</h2>
        <Link 
          to="/productos"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Volver a Productos
        </Link>
      </main>
    );
  }

  const currentCartQuantity = getItemQuantity(product.idProducto);

  return (
    <>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <main style={{ 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '30px', fontSize: '0.9em', color: '#666' }}>
          <Link to="/" style={{ color: '#27ae60', textDecoration: 'none' }}>Inicio</Link>
          {' > '}
          <Link to="/productos" style={{ color: '#27ae60', textDecoration: 'none' }}>Productos</Link>
          {' > '}
          <span>{product.nombre}</span>
        </nav>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Imagen del producto */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            border: '1px solid #e0e0e0'
          }}>
            <img 
              src={product.linkImagen || ProductoService.getImagenGenerica()} 
              alt={product.nombre}
              onError={(e) => {
                e.target.src = ProductoService.getImagenGenerica();
              }}
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Información del producto */}
          <div>
            {/* Categoría */}
            <span style={{
              display: 'inline-block',
              padding: '5px 15px',
              backgroundColor: getCategoryBadgeColor(product.idCategoria),
              color: 'white',
              borderRadius: '20px',
              fontSize: '0.85em',
              marginBottom: '15px'
            }}>
              {getCategoryName(product.idCategoria)}
            </span>

            {/* Nombre */}
            <h1 style={{ 
              margin: '0 0 15px 0',
              fontSize: '2em',
              color: '#2c3e50'
            }}>
              {product.nombre}
            </h1>

            {/* Precio */}
            <div style={{ 
              fontSize: '2em', 
              color: '#27ae60', 
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              ${product.precio?.toLocaleString('es-CL')}
              {product.unidadMedida && (
                <span style={{ fontSize: '0.5em', color: '#666', marginLeft: '8px' }}>
                  {product.unidadMedida}
                </span>
              )}
            </div>

            {/* Stock */}
            <div style={{ 
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: product.stock > 0 ? '#d4edda' : '#f8d7da',
              color: product.stock > 0 ? '#155724' : '#721c24',
              borderRadius: '4px',
              fontSize: '0.9em'
            }}>
              {product.stock > 0 
                ? `✓ ${product.stock} unidades disponibles` 
                : '✗ Sin stock'}
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                fontSize: '1.2em', 
                marginBottom: '10px',
                color: '#2c3e50'
              }}>
                Descripción
              </h3>
              <p style={{ 
                lineHeight: '1.6', 
                color: '#555',
                fontSize: '1em'
              }}>
                {product.descripcion || 'Sin descripción disponible'}
              </p>
            </div>

            {/* Información adicional */}
            <div style={{ 
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px'
            }}>
              <h4 style={{ marginTop: '0', color: '#2c3e50' }}>Información adicional</h4>
              <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>ID:</strong> {product.idProducto}</li>
                {product.origen && <li><strong>Origen:</strong> {product.origen}</li>}
                <li>
                  <strong>Certificación Orgánica:</strong> {product.certificacionOrganica ? '✓ Sí' : '✗ No'}
                </li>
                {product.fechaIngreso && (
                  <li><strong>Fecha de Ingreso:</strong> {new Date(product.fechaIngreso).toLocaleDateString('es-CL')}</li>
                )}
              </ul>
            </div>

            {/* Selector de cantidad y agregar al carrito */}
            {product.stock > 0 && (
              <div style={{ 
                padding: '20px',
                backgroundColor: '#fff',
                border: '2px solid #e0e0e0',
                borderRadius: '8px'
              }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Cantidad:
                </label>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  {/* Botón Menos */}
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '1.5em',
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

                  {/* Input de cantidad */}
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.stock}
                    style={{
                      width: '80px',
                      padding: '10px',
                      fontSize: '1.2em',
                      textAlign: 'center',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      height: '40px',
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />

                  {/* Botón Más */}
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '1.5em',
                      backgroundColor: quantity >= product.stock ? '#e0e0e0' : '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
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

                {/* Botón Agregar al Carrito */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    backgroundColor: addingToCart ? '#95a5a6' : '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: addingToCart ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: addingToCart ? 0.7 : 1
                  }}
                >
                  {addingToCart ? (
                    <>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        border: '3px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }}></span>
                      Agregando...
                    </>
                  ) : (
                    <>
                      Agregar al Carrito
                    </>
                  )}
                </button>

                {/* Mostrar si ya está en el carrito */}
                {currentCartQuantity > 0 && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    textAlign: 'center'
                  }}>
                    Ya tienes {currentCartQuantity} unidad(es) en tu carrito
                  </div>
                )}
              </div>
            )}

            {/* Botón volver */}
            <button
              onClick={() => navigate('/productos')}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1em'
              }}
            >
              ← Volver a Productos
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProductDetail;

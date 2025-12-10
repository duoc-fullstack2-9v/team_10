import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import ProductoService from '../services/producto.service';

function Carrito() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  // Función para manejar cambio de cantidad
  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  // Si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h1 style={{ 
            fontSize: '2.5em', 
            marginBottom: '20px',
            color: '#2c3e50' 
          }}>
            🛒 Tu Carrito está Vacío
          </h1>
          <p style={{ 
            fontSize: '1.1em', 
            color: '#7f8c8d',
            marginBottom: '30px' 
          }}>
            ¡Explora nuestros productos y agrega tus favoritos!
          </p>
          <button
            onClick={() => navigate('/productos')}
            style={{
              padding: '12px 30px',
              fontSize: '1.1em',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      minHeight: '60vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ 
          fontSize: '2.5em', 
          color: '#2c3e50',
          margin: 0
        }}>
          🛒 Mi Carrito
        </h1>
        <button
          onClick={clearCart}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.9em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          🗑️ Vaciar Carrito
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px'
      }}>
        {/* Lista de productos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '20px'
        }}>
          {cartItems.map((item) => {
            // Usar linkImagen si está disponible, sino usar imagen en base64, sino genérica
            const imagenUrl = item.linkImagen || 
              (item.imagen ? `data:image/jpeg;base64,${item.imagen}` : null);
            const subtotal = item.precio * item.quantity;

            return (
              <div
                key={item.idProducto}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr auto',
                  gap: '20px',
                  padding: '20px',
                  borderBottom: '1px solid #ecf0f1',
                  alignItems: 'center'
                }}
              >
                {/* Imagen del producto */}
                <img
                  src={imagenUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="45%25" font-size="80" text-anchor="middle" dy=".3em"%3E🌱%3C/text%3E%3Ctext x="50%25" y="75%25" font-size="14" text-anchor="middle" fill="%23999"%3ESin imagen%3C/text%3E%3C/svg%3E'}
                  alt={item.nombre}
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fa'
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="45%25" font-size="80" text-anchor="middle" dy=".3em"%3E🌱%3C/text%3E%3Ctext x="50%25" y="75%25" font-size="14" text-anchor="middle" fill="%23999"%3ESin imagen%3C/text%3E%3C/svg%3E';
                  }}
                  onClick={() => navigate(`/productos/${item.idProducto}`)}
                />

                {/* Información del producto */}
                <div>
                  <h3 
                    style={{ 
                      margin: '0 0 10px 0',
                      fontSize: '1.3em',
                      color: '#2c3e50',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/productos/${item.idProducto}`)}
                  >
                    {item.nombre}
                  </h3>
                  
                  <p style={{ 
                    margin: '5px 0',
                    color: '#7f8c8d',
                    fontSize: '0.9em'
                  }}>
                    Precio unitario: {formatPrice(item.precio)}
                    {item.unidadMedida && <span style={{ marginLeft: '4px' }}>{item.unidadMedida}</span>}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    <label style={{ 
                      fontWeight: 'bold',
                      color: '#2c3e50'
                    }}>
                      Cantidad:
                    </label>
                    <button
                      onClick={() => handleQuantityChange(item.idProducto, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        padding: '5px 12px',
                        fontSize: '1em',
                        backgroundColor: item.quantity <= 1 ? '#bdc3c7' : '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.stock || 999}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.idProducto, e.target.value)}
                      style={{
                        width: '60px',
                        padding: '5px',
                        textAlign: 'center',
                        border: '1px solid #bdc3c7',
                        borderRadius: '4px',
                        fontSize: '1em'
                      }}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.idProducto, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 999)}
                      style={{
                        padding: '5px 12px',
                        fontSize: '1em',
                        backgroundColor: item.quantity >= (item.stock || 999) ? '#bdc3c7' : '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: item.quantity >= (item.stock || 999) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.idProducto)}
                      style={{
                        padding: '5px 15px',
                        marginLeft: '20px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9em'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div style={{
                  textAlign: 'right',
                  minWidth: '120px'
                }}>
                  <p style={{ 
                    fontSize: '1.5em',
                    fontWeight: 'bold',
                    color: '#27ae60',
                    margin: 0
                  }}>
                    {formatPrice(subtotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen del pedido */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '30px'
        }}>
          <h2 style={{
            fontSize: '1.8em',
            marginBottom: '20px',
            color: '#2c3e50',
            borderBottom: '2px solid #ecf0f1',
            paddingBottom: '10px'
          }}>
            Resumen del Pedido
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '15px',
            fontSize: '1.1em'
          }}>
            <span style={{ color: '#7f8c8d' }}>Total de productos:</span>
            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{getTotalItems()}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #ecf0f1'
          }}>
            <span style={{ 
              fontSize: '1.5em',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Total:
            </span>
            <span style={{ 
              fontSize: '1.8em',
              fontWeight: 'bold',
              color: '#27ae60'
            }}>
              {formatPrice(getTotalPrice())}
            </span>
          </div>

          <button
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '30px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
            onClick={() => alert('Funcionalidad de checkout próximamente')}
          >
            🛒 Proceder al Pago
          </button>

          <button
            onClick={() => navigate('/productos')}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '15px',
              backgroundColor: 'white',
              color: '#27ae60',
              border: '2px solid #27ae60',
              borderRadius: '5px',
              fontSize: '1em',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#27ae60';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#27ae60';
            }}
          >
            ← Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;

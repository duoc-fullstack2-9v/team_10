import React from 'react';
import { useProductos } from '../hooks/useProductos';

function ProductosEjemplo() {
  const { 
    productos, 
    loading, 
    error, 
    buscarProductos, 
    filtrarPorCategoria,
    cargarProductos
  } = useProductos();

  const [busqueda, setBusqueda] = React.useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      buscarProductos(busqueda);
    } else {
      cargarProductos();
    }
  };

  const handleFiltrarCategoria = (categoria) => {
    filtrarPorCategoria(categoria);
  };

  const handleMostrarTodos = () => {
    setBusqueda('');
    cargarProductos();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fee', 
        color: '#c00',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h3>❌ Error al cargar productos</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="productos-container" style={{ padding: '20px' }}>
      <h1>🌱 Productos HuertoHogar</h1>
      
      <form onSubmit={handleBuscar} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          style={{
            padding: '10px',
            width: '300px',
            marginRight: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          🔍 Buscar
        </button>
        <button type="button" onClick={handleMostrarTodos} style={{
          padding: '10px 20px',
          backgroundColor: '#95a5a6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          📋 Todos
        </button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleFiltrarCategoria('Verduras')} style={{
          padding: '8px 15px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          🥬 Verduras
        </button>
        <button onClick={() => handleFiltrarCategoria('Frutas')} style={{
          padding: '8px 15px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          🍎 Frutas
        </button>
        <button onClick={() => handleFiltrarCategoria('Hierbas')} style={{
          padding: '8px 15px',
          backgroundColor: '#16a085',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          🌿 Hierbas
        </button>
      </div>

      <div className="productos-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {productos.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            No se encontraron productos
          </p>
        ) : (
          productos.map((producto) => (
            <div key={producto.id || producto._id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Si la imagen falla, mostrar imagen genérica
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="80" text-anchor="middle" dy=".3em"%3E🌱%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <h3 style={{ margin: '10px 0' }}>{producto.nombre}</h3>
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '10px' }}>
                {producto.descripcion || 'Sin descripción'}
              </p>
              {producto.categoria && (
                <p style={{ 
                  fontSize: '0.8em',
                  backgroundColor: '#ecf0f1',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  📂 {producto.categoria}
                </p>
              )}
              <p style={{ 
                fontSize: '1.2em', 
                fontWeight: 'bold', 
                color: '#27ae60',
                margin: '10px 0'
              }}>
                ${producto.precio}
              </p>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Stock: <strong>{producto.stock || 0}</strong> unidades
              </p>
              <button style={{
                width: '100%',
                padding: '10px',
                backgroundColor: (producto.stock || 0) > 0 ? '#27ae60' : '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (producto.stock || 0) > 0 ? 'pointer' : 'not-allowed'
              }}
              disabled={(producto.stock || 0) === 0}
              >
                {(producto.stock || 0) > 0 ? '🛒 Agregar al carrito' : 'Sin stock'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductosEjemplo;

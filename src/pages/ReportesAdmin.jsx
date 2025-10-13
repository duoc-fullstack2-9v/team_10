import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function ReportesAdmin() {
  const { user, isAdmin } = useAuth();
  
  // Estados para los diferentes reportes
  const [ventasCategoria, setVentasCategoria] = useState([]);
  const [usuariosRegion, setUsuariosRegion] = useState([]);
  const [clientesActivos, setClientesActivos] = useState([]);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [pedidosEstado, setPedidosEstado] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  
  // Estados de carga
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  
  // Estado del reporte activo
  const [activeReport, setActiveReport] = useState('ventas-categoria');

  // Función genérica para cargar datos
  const loadReportData = async (endpoint, setState, reportKey) => {
    try {
      setLoading(prev => ({ ...prev, [reportKey]: true }));
      setErrors(prev => ({ ...prev, [reportKey]: null }));
      
      const response = await fetch(`/api/reportes/${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar ${reportKey}: ${response.status}`);
      }
      
      const data = await response.json();
      setState(data);
      
    } catch (err) {
      console.error(`Error loading ${reportKey}:`, err);
      setErrors(prev => ({ 
        ...prev, 
        [reportKey]: `Error al cargar ${reportKey}: ${err.message}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [reportKey]: false }));
    }
  };

  // Cargar datos al montar componente
  useEffect(() => {
    if (isAdmin()) {
      loadReportData('ventas-categoria', setVentasCategoria, 'ventas-categoria');
      loadReportData('usuarios-region', setUsuariosRegion, 'usuarios-region');
      loadReportData('clientes-activos', setClientesActivos, 'clientes-activos');
      loadReportData('productos-vendidos', setProductosVendidos, 'productos-vendidos');
      loadReportData('stock-bajo', setStockBajo, 'stock-bajo');
      loadReportData('pedidos-estado', setPedidosEstado, 'pedidos-estado');
      loadReportData('auditoria', setAuditoria, 'auditoria');
    }
  }, []);

  // Función para formatear números como moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  // Componente para mostrar error
  const ErrorMessage = ({ error }) => (
    error ? (
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#fee', 
        border: '1px solid #fcc', 
        color: '#c66',
        borderRadius: '4px',
        margin: '10px 0'
      }}>
        {error}
      </div>
    ) : null
  );

  // Componente para mostrar loading
  const LoadingSpinner = ({ isLoading }) => (
    isLoading ? (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite',
          margin: '0 auto'
        }}></div>
        <p>Cargando datos...</p>
      </div>
    ) : null
  );

  if (!isAdmin()) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Acceso Denegado</h2>
        <p>Solo los administradores pueden acceder a los reportes.</p>
        <Link to="/">Volver al Inicio</Link>
      </div>
    );
  }

  const reports = [
    { key: 'ventas-categoria', label: '💰 Ventas por Categoría', icon: '📊' },
    { key: 'usuarios-region', label: '🌎 Usuarios por Región', icon: '👥' },
    { key: 'clientes-activos', label: '⭐ Clientes Activos', icon: '👤' },
    { key: 'productos-vendidos', label: '🏆 Productos Más Vendidos', icon: '📦' },
    { key: 'stock-bajo', label: '⚠️ Stock Bajo', icon: '📉' },
    { key: 'pedidos-estado', label: '📋 Pedidos por Estado', icon: '📈' },
    { key: 'auditoria', label: '🔍 Auditoría Productos', icon: '📝' }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Encabezado */}
      <div style={{ 
        marginBottom: '30px', 
        borderBottom: '2px solid #2c3e50', 
        paddingBottom: '10px' 
      }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>📊 Reportes Administrativos</h1>
        <p style={{ color: '#7f8c8d', margin: '5px 0' }}>
          Panel de análisis y métricas del negocio - {user.nombre}
        </p>
      </div>

      {/* Navegación */}
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/admin" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#95a5a6', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          ← Volver al Panel
        </Link>
        <Link 
          to="/" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#34495e', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}
        >
          🏠 Inicio
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Menú lateral de reportes */}
        <div style={{ 
          width: '250px', 
          backgroundColor: '#ecf0f1', 
          borderRadius: '8px', 
          padding: '15px' 
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Seleccionar Reporte</h3>
          {reports.map(report => (
            <button
              key={report.key}
              onClick={() => setActiveReport(report.key)}
              style={{
                width: '100%',
                padding: '12px 15px',
                margin: '5px 0',
                backgroundColor: activeReport === report.key ? '#3498db' : '#bdc3c7',
                color: activeReport === report.key ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9em',
                transition: 'all 0.3s'
              }}
            >
              {report.icon} {report.label}
            </button>
          ))}
        </div>

        {/* Contenido del reporte */}
        <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
          
          {/* Reporte: Ventas por Categoría */}
          {activeReport === 'ventas-categoria' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>💰 Ventas por Categoría</h2>
              <ErrorMessage error={errors['ventas-categoria']} />
              <LoadingSpinner isLoading={loading['ventas-categoria']} />
              
              {!loading['ventas-categoria'] && !errors['ventas-categoria'] && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Categoría</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Total Ventas</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Unidades</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Pedidos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventasCategoria.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <strong>{item.CATEGORIA}</strong>
                            <br />
                            <small style={{ color: '#7f8c8d' }}>{item.DESCRIPCION}</small>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold', color: '#27ae60' }}>
                            {formatCurrency(item.TOTAL_VENTAS)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.TOTAL_UNIDADES_VENDIDAS?.toLocaleString() || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.TOTAL_PEDIDOS || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {ventasCategoria.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
                      No hay datos de ventas disponibles
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reporte: Usuarios por Región */}
          {activeReport === 'usuarios-region' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🌎 Usuarios por Región</h2>
              <ErrorMessage error={errors['usuarios-region']} />
              <LoadingSpinner isLoading={loading['usuarios-region']} />
              
              {!loading['usuarios-region'] && !errors['usuarios-region'] && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Región</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Total</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Admins</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Vendedores</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Clientes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosRegion.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                            {item.NOMBRE_REGION}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>
                            {item.TOTAL_USUARIOS || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.ADMINISTRADORES || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.VENDEDORES || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.CLIENTES || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reporte: Clientes Activos */}
          {activeReport === 'clientes-activos' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>⭐ Clientes Más Activos</h2>
              <ErrorMessage error={errors['clientes-activos']} />
              <LoadingSpinner isLoading={loading['clientes-activos']} />
              
              {!loading['clientes-activos'] && !errors['clientes-activos'] && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Cliente</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Ubicación</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Pedidos</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Total Gastado</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Promedio</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Última Compra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesActivos.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <strong>{item.NOMBRE}</strong>
                            <br />
                            <small style={{ color: '#7f8c8d' }}>{item.EMAIL}</small>
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            {item.NOMBRE_COMUNA}, {item.NOMBRE_REGION}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.TOTAL_PEDIDOS || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold', color: '#27ae60' }}>
                            {formatCurrency(item.TOTAL_GASTADO)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {formatCurrency(item.PROMEDIO_POR_PEDIDO)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            {formatDate(item.ULTIMA_COMPRA)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reporte: Productos Más Vendidos */}
          {activeReport === 'productos-vendidos' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🏆 Productos Más Vendidos</h2>
              <ErrorMessage error={errors['productos-vendidos']} />
              <LoadingSpinner isLoading={loading['productos-vendidos']} />
              
              {!loading['productos-vendidos'] && !errors['productos-vendidos'] && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Producto</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Categoría</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Precio</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Stock</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Vendido</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosVendidos.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <strong>{item.NOMBRE}</strong>
                            <br />
                            <small style={{ color: '#7f8c8d' }}>{item.ID_PRODUCTO}</small>
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            {item.CATEGORIA}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {formatCurrency(item.PRECIO)}
                          </td>
                          <td style={{ 
                            padding: '12px', 
                            textAlign: 'right', 
                            border: '1px solid #ddd',
                            color: item.STOCK <= 5 ? '#e74c3c' : item.STOCK <= 10 ? '#f39c12' : '#27ae60'
                          }}>
                            {item.STOCK || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>
                            {item.TOTAL_VENDIDO || 0}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold', color: '#27ae60' }}>
                            {formatCurrency(item.INGRESOS_GENERADOS)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reporte: Stock Bajo */}
          {activeReport === 'stock-bajo' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>⚠️ Productos con Stock Bajo</h2>
              <ErrorMessage error={errors['stock-bajo']} />
              <LoadingSpinner isLoading={loading['stock-bajo']} />
              
              {!loading['stock-bajo'] && !errors['stock-bajo'] && (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '3px', marginRight: '10px' }}>
                      SIN STOCK
                    </span>
                    <span style={{ padding: '5px 10px', backgroundColor: '#f39c12', color: 'white', borderRadius: '3px', marginRight: '10px' }}>
                      CRÍTICO (≤5)
                    </span>
                    <span style={{ padding: '5px 10px', backgroundColor: '#f1c40f', color: 'white', borderRadius: '3px' }}>
                      BAJO (≤10)
                    </span>
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Producto</th>
                          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Categoría</th>
                          <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Stock</th>
                          <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Estado</th>
                          <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Precio</th>
                          <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Activo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockBajo.map((item, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                              <strong>{item.NOMBRE}</strong>
                              <br />
                              <small style={{ color: '#7f8c8d' }}>{item.ID_PRODUCTO}</small>
                            </td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                              {item.CATEGORIA}
                            </td>
                            <td style={{ 
                              padding: '12px', 
                              textAlign: 'right', 
                              border: '1px solid #ddd',
                              fontWeight: 'bold',
                              fontSize: '1.1em'
                            }}>
                              {item.STOCK || 0}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                color: 'white',
                                fontSize: '0.8em',
                                backgroundColor: 
                                  item.ESTADO_STOCK === 'SIN STOCK' ? '#e74c3c' :
                                  item.ESTADO_STOCK === 'CRÍTICO' ? '#f39c12' : 
                                  item.ESTADO_STOCK === 'BAJO' ? '#f1c40f' : '#27ae60'
                              }}>
                                {item.ESTADO_STOCK}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                              {formatCurrency(item.PRECIO)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '3px',
                                backgroundColor: item.ESTA_ACTIVO === 'S' ? '#27ae60' : '#e74c3c',
                                color: 'white',
                                fontSize: '0.8em'
                              }}>
                                {item.ESTA_ACTIVO === 'S' ? '✓ Activo' : '✗ Inactivo'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reporte: Pedidos por Estado */}
          {activeReport === 'pedidos-estado' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📋 Resumen de Pedidos por Estado</h2>
              <ErrorMessage error={errors['pedidos-estado']} />
              <LoadingSpinner isLoading={loading['pedidos-estado']} />
              
              {!loading['pedidos-estado'] && !errors['pedidos-estado'] && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Estado</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Cantidad</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Monto Total</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Promedio</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidosEstado.map((item, index) => {
                        const total = pedidosEstado.reduce((acc, curr) => acc + (curr.CANTIDAD_PEDIDOS || 0), 0);
                        const porcentaje = total > 0 ? ((item.CANTIDAD_PEDIDOS / total) * 100).toFixed(1) : 0;
                        
                        return (
                          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                              {item.DESCRIPCION_ESTADO}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>
                              {item.CANTIDAD_PEDIDOS || 0}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold', color: '#27ae60' }}>
                              {formatCurrency(item.TOTAL_MONTO)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                              {formatCurrency(item.PROMEDIO_PEDIDO)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '3px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                fontSize: '0.8em'
                              }}>
                                {porcentaje}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reporte: Auditoría */}
          {activeReport === 'auditoria' && (
            <div>
              <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔍 Auditoría de Productos (Últimos 30 días)</h2>
              <ErrorMessage error={errors['auditoria']} />
              <LoadingSpinner isLoading={loading['auditoria']} />
              
              {!loading['auditoria'] && !errors['auditoria'] && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Fecha</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Producto</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Acción</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Precio Ant.</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Precio Nuevo</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Stock Ant.</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>Stock Nuevo</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Usuario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditoria.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            {formatDate(item.FECHA)}
                          </td>
                          <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <strong>{item.NOMBRE_PRODUCTO || 'N/A'}</strong>
                            <br />
                            <small style={{ color: '#7f8c8d' }}>{item.ID_PRODUCTO}</small>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '3px',
                              color: 'white',
                              fontSize: '0.8em',
                              backgroundColor: item.ACCION === 'UPDATE' ? '#3498db' : '#e74c3c'
                            }}>
                              {item.ACCION}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.PRECIO_ANTERIOR ? formatCurrency(item.PRECIO_ANTERIOR) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.PRECIO_NUEVO ? formatCurrency(item.PRECIO_NUEVO) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.STOCK_ANTERIOR || '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                            {item.STOCK_NUEVO || '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                            <small>{item.USUARIO}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {auditoria.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
                      No hay cambios recientes en productos
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSS para animación de loading */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ReportesAdmin;
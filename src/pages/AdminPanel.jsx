import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UsuarioService from '../services/usuario.service';
import ProductoService from '../services/producto.service';

function AdminPanel() {
  const { user, isAdmin } = useAuth();
  
  // Debug: Verificar datos del usuario
  console.log('AdminPanel - User data:', user);
  console.log('AdminPanel - isAdmin():', isAdmin());
  
  // Estados para la sección activa
  const [activeSection, setActiveSection] = useState('usuarios');
  
  // Estados para usuarios
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  // Estados para productos
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCreateProductForm, setShowCreateProductForm] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Estados para formularios de usuarios
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    direccion: '',
    telefono: '',
    idTipoUsuario: 3,
    idComuna: 1
  });

  // Estados para formularios de productos
  const [productFormData, setProductFormData] = useState({
    idProducto: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    origen: '',
    certificacionOrganica: false,
    estaActivo: true,
    idCategoria: 1
  });

  // Datos de categorías basadas en la API
  const [categories, setCategories] = useState([
    { id: 1, nombre: 'Frutas' },
    { id: 2, nombre: 'Verduras' },
    { id: 3, nombre: 'Otros' },
    { id: 4, nombre: 'Hierbas' }
  ]);

  // Cargar usuarios y productos al montar componente
  useEffect(() => {
    console.log('AdminPanel useEffect - Loading users and products...');
    try {
      loadUsers();
      loadProducts(); // Cargar productos también al inicio
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, []);

  const loadUsers = async () => {
    console.log('loadUsers - Starting...');
    try {
      setLoadingUsers(true);
      console.log('loadUsers - Fetching from UsuarioService...');
      const userData = await UsuarioService.listarUsuarios();
      console.log('loadUsers - Data received:', userData);
      setUsers(userData);
      setErrorUsers('');
      console.log('loadUsers - Success!');
    } catch (err) {
      console.error('loadUsers - Error:', err);
      setErrorUsers('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoadingUsers(false);
      console.log('loadUsers - Finished');
    }
  };

  // ========== FUNCIONES PARA PRODUCTOS ==========

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      console.log('loadProducts - Fetching from ProductoService...');
      const productData = await ProductoService.listarProductos();
      setProducts(productData);
      setErrorProducts('');
      console.log('Productos cargados:', productData);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setErrorProducts('Error al cargar productos: ' + err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // Manejar diferentes tipos de campos
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (name === 'idProducto') {
      // Para el ID del producto, convertir a mayúsculas automáticamente
      processedValue = value.toUpperCase();
    } else if (name === 'certificacionOrganica') {
      // Para certificación orgánica, convertir string a boolean
      processedValue = value === 'true' || value === true;
    }
    
    console.log(`🔧 Campo ${name} actualizado:`, processedValue);
    
    setProductFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      direccion: '',
      telefono: '',
      idTipoUsuario: 3,
      idComuna: 1
    });
    setEditingUser(null);
  };

  const closeForm = () => {
    resetForm();
    setShowCreateForm(false);
  };

  // Crear nuevo usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    setSavingUser(true);
    try {
      const userData = {
        ...formData,
        telefono: parseInt(formData.telefono),
        fechaRegistro: new Date().toISOString().split('T')[0]
      };

      await UsuarioService.registrar(userData);
      alert('Usuario creado exitosamente');
      closeForm();
      loadUsers();
    } catch (err) {
      alert('Error al crear usuario: ' + err.message);
    } finally {
      setSavingUser(false);
    }
  };

  // Editar usuario existente
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    setSavingUser(true);
    try {
      const userData = {
        ...formData,
        telefono: parseInt(formData.telefono)
      };

      await UsuarioService.actualizarUsuario(editingUser.id, userData);
      alert('Usuario actualizado exitosamente');
      closeForm();
      loadUsers();
    } catch (err) {
      alert('Error al actualizar usuario: ' + err.message);
    } finally {
      setSavingUser(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId, userName) => {
    if (userId === user.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }

    if (window.confirm(`¿Estás seguro de eliminar al usuario "${userName}"?`)) {
      try {
        await UsuarioService.eliminarUsuario(userId);
        alert('Usuario eliminado exitosamente');
        loadUsers();
      } catch (err) {
        alert('Error al eliminar usuario: ' + err.message);
      }
    }
  };

  // Preparar edición
  const startEditUser = (userToEdit) => {
    setFormData({
      nombre: userToEdit.nombre,
      email: userToEdit.email,
      password: userToEdit.password,
      direccion: userToEdit.direccion,
      telefono: userToEdit.telefono.toString(),
      idTipoUsuario: userToEdit.idTipoUsuario,
      idComuna: userToEdit.idComuna
    });
    setEditingUser(userToEdit);
    setShowCreateForm(false);
  };

  const getTipoUsuarioText = (idTipo) => {
    switch (idTipo) {
      case 1: return 'Administrador';
      case 2: return 'Vendedor';
      case 3: return 'Cliente';
      default: return 'Desconocido';
    }
  };

  const getTipoUsuarioColor = (idTipo) => {
    switch (idTipo) {
      case 1: return '#e74c3c'; // Rojo para admin
      case 2: return '#f39c12'; // Naranja para vendedor
      case 3: return '#27ae60'; // Verde para cliente
      default: return '#95a5a6';
    }
  };

  // ========== FUNCIONES CRUD PARA PRODUCTOS ==========

  // Crear producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    // Validar datos requeridos
    if (!productFormData.idProducto || !productFormData.nombre || !productFormData.precio) {
      alert('Por favor completa todos los campos requeridos: ID, Nombre y Precio');
      return;
    }

    // Validar formato del ID
    const idPattern = /^[A-Z]{2}[0-9]{3}$/;
    if (!idPattern.test(productFormData.idProducto)) {
      alert('El ID del producto debe seguir el formato XX000 (2 letras mayúsculas + 3 números)');
      return;
    }

    setSavingProduct(true);
    try {
      console.log('🚀 Iniciando creación de producto...');
      console.log('📝 Datos del formulario:', productFormData);
      
      const productData = {
        ...productFormData,
        precio: parseFloat(productFormData.precio) || 0,
        stock: parseInt(productFormData.stock) || 0,
        idCategoria: parseInt(productFormData.idCategoria) || 1
      };

      console.log('📦 Datos a enviar:', productData);

      const createdProduct = await ProductoService.crearProducto(productData);
      console.log('✅ Producto creado:', createdProduct);
      alert('Producto creado exitosamente: ' + createdProduct.nombre);
      resetProductForm();
      loadProducts();
    } catch (err) {
      console.error('💥 Error en handleCreateProduct:', err);
      alert('Error al crear producto: ' + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  // Actualizar producto
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    setSavingProduct(true);
    try {
      const productData = {
        ...productFormData,
        precio: parseFloat(productFormData.precio),
        stock: parseInt(productFormData.stock),
        idCategoria: parseInt(productFormData.idCategoria)
      };

      await ProductoService.actualizarProducto(productData.idProducto, productData);
      alert('Producto actualizado exitosamente');
      closeProductForm();
      loadProducts();
    } catch (err) {
      alert('Error al actualizar producto: ' + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      try {
        await ProductoService.eliminarProducto(productId);
        alert('Producto eliminado exitosamente');
        loadProducts();
      } catch (err) {
        alert('Error al eliminar producto: ' + err.message);
      }
    }
  };

  // Preparar edición de producto
  const startEditProduct = (product) => {
    setProductFormData({
      idProducto: product.idProducto,
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      origen: product.origen || '',
      certificacionOrganica: product.certificacionOrganica || false,
      estaActivo: product.estaActivo || true,
      idCategoria: product.idCategoria || 1
    });
    setEditingProduct(product);
    setShowCreateProductForm(false);
  };

  // Limpiar datos del formulario solamente
  const clearProductFormData = () => {
    console.log('🧹 Limpiando datos del formulario');
    setProductFormData({
      idProducto: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      origen: '',
      certificacionOrganica: false,
      estaActivo: true,
      idCategoria: 1
    });
  };

  // Resetear formulario completo (datos + cerrar formulario)
  const resetProductForm = () => {
    console.log('🔄 resetProductForm llamado - cerrando formulario');
    clearProductFormData();
    setEditingProduct(null);
    setShowCreateProductForm(false);
    console.log('🔄 resetProductForm completado');
  };

  // Cerrar formulario de producto
  const closeProductForm = () => {
    resetProductForm();
  };

  // Obtener nombre de categoría
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.nombre : 'Sin categoría';
  };

  // Cargar datos al cambiar de sección
  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === 'usuarios' && users.length === 0) {
      loadUsers();
    } else if (section === 'productos' && products.length === 0) {
      loadProducts(); // Solo cargar si no hay productos cargados
    }
  };

  if (!isAdmin()) {
    console.log('AdminPanel - Access denied, not admin');
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Acceso Denegado</h2>
        <p>Solo los administradores pueden acceder a esta página.</p>
        <Link to="/">Volver al Inicio</Link>
      </div>
    );
  }

  console.log('AdminPanel - Rendering main panel...', {
    activeSection,
    usersLength: users.length,
    productsLength: products.length,
    loadingUsers,
    loadingProducts
  });

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Panel de Administración</h1>
        <p style={{ color: '#7f8c8d', margin: '5px 0' }}>
          Bienvenido, {user.nombre} | Sistema de gestión integral
        </p>
      </div>

      {/* Navegación del panel */}
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/admin/reportes" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#3498db', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          📊 Ver Reportes
        </Link>
        <Link 
          to="/" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#95a5a6', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}
        >
          🏠 Volver al Inicio
        </Link>
      </div>

      {/* Pestañas de sección */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => handleSectionChange('usuarios')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeSection === 'usuarios' ? '#3498db' : '#ecf0f1',
            color: activeSection === 'usuarios' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            marginRight: '5px',
            fontWeight: activeSection === 'usuarios' ? 'bold' : 'normal'
          }}
        >
          👥 Gestión de Usuarios ({users.length})
        </button>
        <button
          onClick={() => handleSectionChange('productos')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeSection === 'productos' ? '#27ae60' : '#ecf0f1',
            color: activeSection === 'productos' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: activeSection === 'productos' ? 'bold' : 'normal'
          }}
        >
          📦 Gestión de Productos ({products.length})
        </button>
      </div>

      {/* ================= SECCIÓN DE USUARIOS ================= */}
      {activeSection === 'usuarios' && (
        <div>
          {/* Botones de acción */}
          <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => { 
            setShowCreateForm(true); 
            resetForm(); 
          }}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          ➕ Crear Usuario
        </button>
        <button 
          onClick={loadUsers}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Recargar Lista
        </button>
      </div>

      {/* Formulario de crear/editar */}
      {(showCreateForm || editingUser) && (
        <div style={{ 
          backgroundColor: '#ecf0f1', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h3>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
          
          <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              
              <div>
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              
              <div>
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              
              <div>
                <label>Tipo de Usuario:</label>
                <select
                  name="idTipoUsuario"
                  value={formData.idTipoUsuario}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Vendedor</option>
                  <option value={3}>Cliente</option>
                </select>
              </div>
              
              <div>
                <label>Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '15px' }}>
              <button 
                type="submit"
                disabled={savingUser}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: savingUser ? '#95a5a6' : '#27ae60', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: savingUser ? 'not-allowed' : 'pointer',
                  marginRight: '10px',
                  opacity: savingUser ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {savingUser && (
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block'
                  }}></span>
                )}
                {savingUser ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear') + ' Usuario'}
              </button>
              <button 
                type="button"
                onClick={closeForm}
                disabled={savingUser}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#95a5a6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: savingUser ? 'not-allowed' : 'pointer',
                  opacity: savingUser ? 0.5 : 1
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      <div>
        <h3>Lista de Usuarios ({users.length})</h3>
        
        {loadingUsers ? (
          <p>Cargando usuarios...</p>
        ) : errorUsers ? (
          <p style={{ color: 'red' }}>{errorUsers}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Tipo</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Teléfono</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Dirección</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => (
                  <tr key={userData.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{userData.id}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{userData.nombre}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{userData.email}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        color: 'white',
                        backgroundColor: getTipoUsuarioColor(userData.idTipoUsuario),
                        fontSize: '0.8em'
                      }}>
                        {getTipoUsuarioText(userData.idTipoUsuario)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{userData.telefono}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{userData.direccion}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => startEditUser(userData)}
                        style={{ 
                          padding: '5px 10px', 
                          backgroundColor: '#f39c12', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '3px',
                          cursor: 'pointer',
                          marginRight: '5px',
                          fontSize: '0.8em'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(userData.id, userData.nombre)}
                        style={{ 
                          padding: '5px 10px', 
                          backgroundColor: '#e74c3c', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '0.8em'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </div>
      )}

      {/* ================= SECCIÓN DE PRODUCTOS ================= */}
      {activeSection === 'productos' && (
        <div>
          {/* Botones de acción para productos */}
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => { 
                console.log('🟢 Botón "Crear Producto" clickeado');
                console.log('📋 Estado antes:', {showCreateProductForm, editingProduct});
                setShowCreateProductForm(true); 
                clearProductFormData(); // Solo limpiar datos, no cerrar formulario
                console.log('📋 Formulario debería mostrarse ahora');
              }}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#27ae60', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              ➕ Crear Producto
            </button>
            <button 
              onClick={loadProducts}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Recargar Lista
            </button>
          </div>

          {/* Formulario de crear/editar producto */}
          {(() => {
            const shouldShow = showCreateProductForm || editingProduct;
            console.log('🔍 Condición formulario:', {showCreateProductForm, editingProduct, shouldShow});
            return shouldShow;
          })() && (
            <div style={{ 
              backgroundColor: '#ecf0f1', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <h3>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
              
              <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label>ID del Producto:</label>
                    <input
                      type="text"
                      name="idProducto"
                      value={productFormData.idProducto}
                      onChange={handleProductInputChange}
                      required={!editingProduct}
                      disabled={editingProduct}
                      placeholder="Ej: FR001 (2 letras + 3 números)"
                      pattern="^[A-Z]{2}[0-9]{3}$"
                      title="El ID debe seguir el formato XX000 (2 letras mayúsculas + 3 números)"
                      maxLength="5"
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        marginTop: '5px',
                        backgroundColor: editingProduct ? '#f0f0f0' : 'white'
                      }}
                    />
                    {!editingProduct && (
                      <small style={{color: '#666', fontSize: '12px', display: 'block', marginTop: '3px'}}>
                        Formato: 2 letras mayúsculas + 3 números (Ej: FR001, VR002, PO001)
                      </small>
                    )}
                  </div>
                  
                  <div>
                    <label>Nombre del Producto:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={productFormData.nombre}
                      onChange={handleProductInputChange}
                      required
                      placeholder="Ej: Tomates Orgánicos"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                  
                  <div style={{ gridColumn: 'span 2' }}>
                    <label>Descripción:</label>
                    <textarea
                      name="descripcion"
                      value={productFormData.descripcion}
                      onChange={handleProductInputChange}
                      rows="3"
                      placeholder="Descripción detallada del producto..."
                      style={{ width: '100%', padding: '8px', marginTop: '5px', resize: 'vertical' }}
                    />
                  </div>
                  
                  <div>
                    <label>Precio ($):</label>
                    <input
                      type="number"
                      name="precio"
                      value={productFormData.precio}
                      onChange={handleProductInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="2500"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                  
                  <div>
                    <label>Stock Actual:</label>
                    <input
                      type="number"
                      name="stock"
                      value={productFormData.stock}
                      onChange={handleProductInputChange}
                      required
                      min="0"
                      placeholder="100"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                  
                  <div>
                    <label>Origen:</label>
                    <input
                      type="text"
                      name="origen"
                      value={productFormData.origen}
                      onChange={handleProductInputChange}
                      placeholder="Valle del Maule"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                  
                  <div>
                    <label>Categoría:</label>
                    <select
                      name="idCategoria"
                      value={productFormData.idCategoria}
                      onChange={handleProductInputChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>Estado:</label>
                    <select
                      name="estaActivo"
                      value={productFormData.estaActivo}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setProductFormData(prev => ({
                          ...prev,
                          [name]: value === 'true'
                        }));
                      }}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Inactivo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label>Certificación Orgánica:</label>
                    <select
                      name="certificacionOrganica"
                      value={productFormData.certificacionOrganica}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setProductFormData(prev => ({
                          ...prev,
                          [name]: value === 'true'
                        }));
                      }}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      <option value={false}>No Orgánico</option>
                      <option value={true}>Orgánico</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginTop: '15px' }}>
                  <button 
                    type="submit"
                    disabled={savingProduct}
                    onClick={() => console.log('🔴 Botón Submit clickeado - editingProduct:', editingProduct)}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: savingProduct ? '#95a5a6' : '#27ae60', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: savingProduct ? 'not-allowed' : 'pointer',
                      marginRight: '10px',
                      opacity: savingProduct ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {savingProduct && (
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block'
                      }}></span>
                    )}
                    {savingProduct ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear') + ' Producto'}
                  </button>
                  <button 
                    type="button"
                    onClick={closeProductForm}
                    disabled={savingProduct}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#95a5a6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: savingProduct ? 'not-allowed' : 'pointer',
                      opacity: savingProduct ? 0.5 : 1
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de productos */}
          <div>
            <h3>Lista de Productos ({products.length})</h3>
            
            {loadingProducts ? (
              <p>Cargando productos...</p>
            ) : errorProducts ? (
              <p style={{ color: 'red' }}>{errorProducts}</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#27ae60', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Nombre</th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Categoría</th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Precio</th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Stock</th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Stock Min.</th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Estado</th>
                      <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.idProducto} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.idProducto}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <div>
                            <strong>{product.nombre}</strong>
                            {product.descripcion && (
                              <div style={{ fontSize: '0.9em', color: '#666', marginTop: '2px' }}>
                                {product.descripcion.length > 50 ? 
                                  product.descripcion.substring(0, 50) + '...' : 
                                  product.descripcion}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          {getCategoryName(product.idCategoria)}
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <strong>${product.precio?.toLocaleString('es-CL')}</strong>
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <span style={{
                            color: product.stock <= (product.stockMinimo || 5) ? '#e74c3c' : '#27ae60'
                          }}>
                            {product.stock}
                          </span>
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.stockMinimo || 5}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            color: 'white',
                            backgroundColor: product.estaActivo ? '#27ae60' : '#e74c3c',
                            fontSize: '0.8em'
                          }}>
                            {product.estaActivo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                          <button
                            onClick={() => startEditProduct(product)}
                            style={{ 
                              padding: '5px 10px', 
                              backgroundColor: '#f39c12', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '3px',
                              cursor: 'pointer',
                              marginRight: '5px',
                              fontSize: '0.8em'
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.idProducto, product.nombre)}
                            style={{ 
                              padding: '5px 10px', 
                              backgroundColor: '#e74c3c', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '0.8em'
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {products.length === 0 && !loadingProducts && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    marginTop: '10px'
                  }}>
                    <h4 style={{ color: '#6c757d' }}>No hay productos registrados</h4>
                    <p style={{ color: '#6c757d' }}>Haz clic en "Crear Producto" para agregar el primer producto.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default AdminPanel;
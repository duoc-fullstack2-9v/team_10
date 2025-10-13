import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    direccion: '',
    telefono: '',
    idTipoUsuario: 3,
    idComuna: 1
  });

  // Cargar usuarios al montar componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/usuarios');
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    try {
      const userData = {
        ...formData,
        telefono: parseInt(formData.telefono),
        fechaRegistro: new Date().toISOString().split('T')[0]
      };

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        closeForm();
        loadUsers();
      } else {
        const errorText = await response.text();
        alert('Error al crear usuario: ' + errorText);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Editar usuario existente
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        ...formData,
        telefono: parseInt(formData.telefono),
        idUsuario: editingUser.idUsuario
      };

      const response = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        alert('Usuario actualizado exitosamente');
        closeForm();
        loadUsers();
      } else {
        const errorText = await response.text();
        alert('Error al actualizar usuario: ' + errorText);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId, userName) => {
    if (userId === user.idUsuario) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }

    if (window.confirm(`¿Estás seguro de eliminar al usuario "${userName}"?`)) {
      try {
        const response = await fetch(`/api/usuarios/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Usuario eliminado exitosamente');
          loadUsers();
        } else {
          const errorText = await response.text();
          alert('Error al eliminar usuario: ' + errorText);
        }
      } catch (err) {
        alert('Error: ' + err.message);
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

  if (!isAdmin()) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Acceso Denegado</h2>
        <p>Solo los administradores pueden acceder a esta página.</p>
        <Link to="/">Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Panel de Administración</h1>
        <p style={{ color: '#7f8c8d', margin: '5px 0' }}>
          Bienvenido, {user.nombre} | Gestión de usuarios del sistema
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
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </button>
              <button 
                type="button"
                onClick={closeForm}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#95a5a6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
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
        
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
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
                  <tr key={userData.idUsuario} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{userData.idUsuario}</td>
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
                        onClick={() => handleDeleteUser(userData.idUsuario, userData.nombre)}
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
  );
}

export default AdminPanel;
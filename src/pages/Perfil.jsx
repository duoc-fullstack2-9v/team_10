import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UsuarioService from '../services/usuario.service';
import Toast from '../components/Toast';

function Perfil() {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    telefono: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Cargar datos del usuario
    setFormData({
      nombre: user.nombre || '',
      email: user.email || '',
      direccion: user.direccion || '',
      telefono: user.telefono?.toString() || '',
      password: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [user, isAuthenticated, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.email) {
      showToast('Nombre y email son obligatorios', 'error');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Por favor ingresa un email válido', 'error');
      return;
    }

    // Validar teléfono si se proporcionó
    if (formData.telefono && !/^[0-9]{9}$/.test(formData.telefono)) {
      showToast('El teléfono debe tener 9 dígitos', 'error');
      return;
    }

    // Si se intenta cambiar la contraseña
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
      }
      if (formData.newPassword.length < 6) {
        showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }
    }

    setSaving(true);

    try {
      const dataToUpdate = {
        nombre: formData.nombre,
        email: formData.email,
        direccion: formData.direccion || null,
        telefono: formData.telefono ? parseInt(formData.telefono) : null,
        idTipoUsuario: user.idTipoUsuario,
        idComuna: user.idComuna || 1
      };

      // Si hay nueva contraseña, incluirla
      if (formData.newPassword) {
        dataToUpdate.password = formData.newPassword;
      } else {
        // Mantener la contraseña actual
        dataToUpdate.password = user.password;
      }

      // Usar id o idUsuario (compatibilidad con ambas versiones)
      const userId = user.id || user.idUsuario;
      
      if (!userId) {
        showToast('Error: No se pudo identificar el usuario. Por favor, inicia sesión nuevamente.', 'error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      await UsuarioService.actualizarUsuario(userId, dataToUpdate);
      
      // Actualizar el contexto de autenticación
      updateUser({
        ...user,
        ...dataToUpdate
      });

      showToast('Perfil actualizado exitosamente', 'success');
      setEditMode(false);
      
      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      showToast(error.message || 'Error al actualizar el perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    // Restaurar datos originales
    setFormData({
      nombre: user.nombre || '',
      email: user.email || '',
      direccion: user.direccion || '',
      telefono: user.telefono?.toString() || '',
      password: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <main className="main">
      {toast.message && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ message: '', type: '' })} 
        />
      )}

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '60px 5%' 
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <h1 style={{ 
            fontSize: '2.2em', 
            color: '#2c3e50', 
            marginBottom: '10px' 
          }}>
            Mi Perfil
          </h1>
          <p style={{ 
            color: '#7f8c8d',
            fontSize: '1.1em'
          }}>
            Gestiona tu información personal
          </p>
        </div>

        {/* Información del usuario */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '30px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              color: '#2c3e50',
              fontSize: '1.5em',
              margin: 0
            }}>
              Información Personal
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.95em',
                  fontWeight: '500'
                }}
              >
                Editar
              </button>
            )}
          </div>

          {!editMode ? (
            // Modo vista
            <div>
              <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '5px'
              }}>
                <label style={{ 
                  display: 'block', 
                  color: '#7f8c8d',
                  fontSize: '0.9em',
                  marginBottom: '5px'
                }}>
                  Nombre completo
                </label>
                <p style={{ 
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {user.nombre}
                </p>
              </div>

              <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '5px'
              }}>
                <label style={{ 
                  display: 'block', 
                  color: '#7f8c8d',
                  fontSize: '0.9em',
                  marginBottom: '5px'
                }}>
                  Email
                </label>
                <p style={{ 
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {user.email}
                </p>
              </div>

              <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '5px'
              }}>
                <label style={{ 
                  display: 'block', 
                  color: '#7f8c8d',
                  fontSize: '0.9em',
                  marginBottom: '5px'
                }}>
                  Dirección
                </label>
                <p style={{ 
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {user.direccion || 'No especificada'}
                </p>
              </div>

              <div style={{ 
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '5px'
              }}>
                <label style={{ 
                  display: 'block', 
                  color: '#7f8c8d',
                  fontSize: '0.9em',
                  marginBottom: '5px'
                }}>
                  Teléfono
                </label>
                <p style={{ 
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {user.telefono || 'No especificado'}
                </p>
              </div>
            </div>
          ) : (
            // Modo edición
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle, número, comuna"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Teléfono (9 dígitos)
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="987654321"
                  maxLength="9"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Cambio de contraseña */}
              <div style={{ 
                backgroundColor: '#fff3cd', 
                padding: '20px', 
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  color: '#856404',
                  fontSize: '1.1em',
                  marginBottom: '15px'
                }}>
                  Cambiar Contraseña (opcional)
                </h3>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: '#856404',
                    fontWeight: '500' 
                  }}>
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    color: '#856404',
                    fontWeight: '500' 
                  }}>
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la nueva contraseña"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Botones */}
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: saving ? '#95a5a6' : '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Información adicional */}
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          padding: '20px', 
          borderRadius: '8px',
          borderLeft: '4px solid #27ae60'
        }}>
          <h3 style={{ 
            color: '#27ae60',
            fontSize: '1.1em',
            marginBottom: '10px'
          }}>
            Tipo de cuenta
          </h3>
          <p style={{ 
            color: '#2c3e50',
            margin: 0
          }}>
            {user.idTipoUsuario === 1 ? 'Administrador' : 
             user.idTipoUsuario === 2 ? 'Vendedor' : 'Cliente'}
          </p>
        </div>
      </div>
    </main>
  );
}

export default Perfil;

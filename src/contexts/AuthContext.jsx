import { createContext, useContext, useState, useEffect } from 'react';
import UsuarioService from '../services/usuario.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Login usando el servicio de usuarios
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{success: boolean, message: string, user?: object}>}
   */
  const login = async (email, password) => {
    try {
      const response = await UsuarioService.login({ email, password });
      
      if (response.usuario) {
        setUser(response.usuario);
        localStorage.setItem('user', JSON.stringify(response.usuario));
        
        return { 
          success: true, 
          message: 'Login exitoso',
          user: response.usuario 
        };
      }
      
      return { 
        success: false, 
        message: 'Credenciales inválidas' 
      };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión. Verifica tus credenciales.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    UsuarioService.logout();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Funciones para verificar roles
  const isAdmin = () => user?.idTipoUsuario === 1;
  const isVendedor = () => user?.idTipoUsuario === 2;
  const isCliente = () => user?.idTipoUsuario === 3;
  const isAuthenticated = () => !!user;

  // Función para obtener el nombre del rol
  const getRoleName = () => {
    if (!user) return 'Sin autenticar';
    switch (user.idTipoUsuario) {
      case 1: return 'Administrador';
      case 2: return 'Vendedor';
      case 3: return 'Cliente';
      default: return 'Desconocido';
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAdmin,
    isVendedor,
    isCliente,
    isAuthenticated,
    getRoleName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
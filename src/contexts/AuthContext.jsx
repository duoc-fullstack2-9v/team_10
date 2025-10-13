import { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
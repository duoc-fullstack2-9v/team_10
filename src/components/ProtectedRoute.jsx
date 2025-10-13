import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, fallback = null }) => {
  const { user, isAuthenticated, isAdmin, isVendedor, isCliente } = useAuth();

  // Si no está autenticado
  if (!isAuthenticated()) {
    return fallback || (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        background: '#fee', 
        border: '1px solid #fcc', 
        color: '#c66',
        borderRadius: '4px',
        margin: '20px'
      }}>
        <h3>Acceso Denegado</h3>
        <p>Debes iniciar sesión para acceder a esta página.</p>
      </div>
    );
  }

  // Si se requiere un rol específico
  if (requiredRole) {
    let hasAccess = false;
    
    switch (requiredRole) {
      case 'admin':
        hasAccess = isAdmin();
        break;
      case 'vendedor':
        hasAccess = isVendedor() || isAdmin(); // Admin puede acceder a rutas de vendedor
        break;
      case 'cliente':
        hasAccess = isCliente() || isVendedor() || isAdmin(); // Todos pueden acceder a rutas de cliente
        break;
      default:
        hasAccess = true;
    }

    if (!hasAccess) {
      return fallback || (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          background: '#fee', 
          border: '1px solid #fcc', 
          color: '#c66',
          borderRadius: '4px',
          margin: '20px'
        }}>
          <h3>Acceso Denegado</h3>
          <p>No tienes permisos para acceder a esta página.</p>
          <p>Rol requerido: <strong>{requiredRole}</strong></p>
          <p>Tu rol actual: <strong>{user?.idTipoUsuario === 1 ? 'Administrador' : 
                                      user?.idTipoUsuario === 2 ? 'Vendedor' : 
                                      user?.idTipoUsuario === 3 ? 'Cliente' : 'Desconocido'}</strong></p>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
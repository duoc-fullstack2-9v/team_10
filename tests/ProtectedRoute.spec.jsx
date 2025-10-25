import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProtectedRoute from '../src/components/ProtectedRoute';

// Mock del AuthContext
const mockAuthContext = {
  user: null,
  isAuthenticated: vi.fn(),
  isAdmin: vi.fn(),
  isVendedor: vi.fn(),
  isCliente: vi.fn()
};

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

describe('Componente ProtectedRoute', () => {
  beforeEach(() => {
    // Reset mocks antes de cada test
    vi.clearAllMocks();
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated.mockReturnValue(false);
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.isVendedor.mockReturnValue(false);
    mockAuthContext.isCliente.mockReturnValue(false);
  });

  it('renderiza children cuando el usuario está autenticado y no se requiere rol específico', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);

    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('muestra mensaje de acceso denegado cuando no está autenticado', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(false);

    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    expect(screen.getByText('Debes iniciar sesión para acceder a esta página.')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('renderiza fallback personalizado cuando no está autenticado', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(false);

    const customFallback = <div>Fallback personalizado</div>;

    render(
      <ProtectedRoute fallback={customFallback}>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Fallback personalizado')).toBeInTheDocument();
    expect(screen.queryByText('Acceso Denegado')).not.toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('permite acceso a admin cuando requiredRole es admin', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isAdmin.mockReturnValue(true);
    mockAuthContext.user = { idTipoUsuario: 1 };

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Panel de administración</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Panel de administración')).toBeInTheDocument();
  });

  it('deniega acceso cuando no es admin pero se requiere rol admin', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.isCliente.mockReturnValue(true);
    mockAuthContext.user = { idTipoUsuario: 3 };

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Panel de administración</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    expect(screen.getByText('No tienes permisos para acceder a esta página.')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument();
  });

  it('permite acceso a vendedor cuando requiredRole es vendedor', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isVendedor.mockReturnValue(true);
    mockAuthContext.user = { idTipoUsuario: 2 };

    render(
      <ProtectedRoute requiredRole="vendedor">
        <div>Panel de vendedor</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Panel de vendedor')).toBeInTheDocument();
  });

  it('permite acceso a admin en rutas de vendedor', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isAdmin.mockReturnValue(true);
    mockAuthContext.isVendedor.mockReturnValue(false);
    mockAuthContext.user = { idTipoUsuario: 1 };

    render(
      <ProtectedRoute requiredRole="vendedor">
        <div>Panel de vendedor</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Panel de vendedor')).toBeInTheDocument();
  });

  it('permite acceso a cliente cuando requiredRole es cliente', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isCliente.mockReturnValue(true);
    mockAuthContext.user = { idTipoUsuario: 3 };

    render(
      <ProtectedRoute requiredRole="cliente">
        <div>Área de cliente</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Área de cliente')).toBeInTheDocument();
  });

  it('permite acceso a vendedor y admin en rutas de cliente', () => {
    // Test para vendedor
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isVendedor.mockReturnValue(true);
    mockAuthContext.isCliente.mockReturnValue(false);
    mockAuthContext.user = { idTipoUsuario: 2 };

    const { rerender } = render(
      <ProtectedRoute requiredRole="cliente">
        <div>Área de cliente</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Área de cliente')).toBeInTheDocument();

    // Test para admin
    mockAuthContext.isVendedor.mockReturnValue(false);
    mockAuthContext.isAdmin.mockReturnValue(true);
    mockAuthContext.user = { idTipoUsuario: 1 };

    rerender(
      <ProtectedRoute requiredRole="cliente">
        <div>Área de cliente</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Área de cliente')).toBeInTheDocument();
  });

  it('muestra el rol correcto en el mensaje de error', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.isVendedor.mockReturnValue(false);
    mockAuthContext.isCliente.mockReturnValue(true);
    mockAuthContext.user = { idTipoUsuario: 3 };

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Panel admin</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Rol requerido:')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('Tu rol actual:')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
  });

  it('maneja rol de usuario desconocido', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.user = { idTipoUsuario: 999 };

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Panel admin</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Desconocido')).toBeInTheDocument();
  });

  it('maneja usuario sin idTipoUsuario', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.user = {};

    render(
      <ProtectedRoute requiredRole="admin">
        <div>Panel admin</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Desconocido')).toBeInTheDocument();
  });

  it('aplica estilos CSS correctos al mensaje de error', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(false);

    render(
      <ProtectedRoute>
        <div>Contenido</div>
      </ProtectedRoute>
    );

    const errorDiv = screen.getByText('Acceso Denegado').closest('div');
    expect(errorDiv).toHaveStyle({
      padding: '20px',
      textAlign: 'center',
      background: '#fee',
      border: '1px solid #fcc',
      color: '#c66',
      borderRadius: '4px',
      margin: '20px'
    });
  });

  it('funciona con requiredRole undefined o null', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);

    render(
      <ProtectedRoute requiredRole={null}>
        <div>Contenido sin rol específico</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Contenido sin rol específico')).toBeInTheDocument();
  });
});
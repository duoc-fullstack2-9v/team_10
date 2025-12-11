import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../src/components/ProtectedRoute';

// Mock del hook useAuth
let mockAuthValue = {
  user: null,
  isAuthenticated: () => false,
  isAdmin: () => false,
  isVendedor: () => false,
  isCliente: () => false
};

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => mockAuthValue
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    mockAuthValue = {
      user: null,
      isAuthenticated: () => false,
      isAdmin: () => false,
      isVendedor: () => false,
      isCliente: () => false
    };
  });

  it('renders children when user is authenticated', () => {
    mockAuthValue = {
      user: { idTipoUsuario: 3, nombre: 'Test User' },
      isAuthenticated: () => true,
      isAdmin: () => false,
      isVendedor: () => false,
      isCliente: () => true
    };

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows access denied when user is not authenticated', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    expect(screen.getByText(/Debes iniciar sesión/)).toBeInTheDocument();
  });

  it('allows admin access to admin routes', () => {
    mockAuthValue = {
      user: { idTipoUsuario: 1, nombre: 'Admin User' },
      isAuthenticated: () => true,
      isAdmin: () => true,
      isVendedor: () => false,
      isCliente: () => false
    };

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="admin">
          <div>Admin Panel</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('denies client access to admin routes', () => {
    mockAuthValue = {
      user: { idTipoUsuario: 3, nombre: 'Client User' },
      isAuthenticated: () => true,
      isAdmin: () => false,
      isVendedor: () => false,
      isCliente: () => true
    };

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="admin">
          <div>Admin Panel</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    expect(screen.getByText(/No tienes permisos/)).toBeInTheDocument();
  });

  it('allows vendedor access to vendedor routes', () => {
    mockAuthValue = {
      user: { idTipoUsuario: 2, nombre: 'Vendedor User' },
      isAuthenticated: () => true,
      isAdmin: () => false,
      isVendedor: () => true,
      isCliente: () => false
    };

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="vendedor">
          <div>Vendedor Panel</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Vendedor Panel')).toBeInTheDocument();
  });

  it('renders custom fallback when provided and not authenticated', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute fallback={<div>Custom Fallback</div>}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
  });
});

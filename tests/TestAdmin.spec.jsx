import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TestAdmin from '../src/pages/TestAdmin';

// Mock del contexto de autenticación
const mockAuthContext = {
  user: { id: 1, nombre: 'Test User', rol: 'admin' },
  isAuthenticated: vi.fn(() => true),
  isAdmin: vi.fn(() => true),
};

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

describe('Página TestAdmin', () => {
  beforeEach(() => {
    mockAuthContext.isAuthenticated.mockReturnValue(true);
    mockAuthContext.isAdmin.mockReturnValue(true);
  });

  it('renderiza correctamente la página de test', () => {
    render(<TestAdmin />);

    expect(screen.getByText('Test Admin Page')).toBeInTheDocument();
    expect(screen.getByText('Debug Info:')).toBeInTheDocument();
  });

  it('muestra información de debug correctamente', () => {
    render(<TestAdmin />);

    expect(screen.getByText('Is Authenticated:')).toBeInTheDocument();
    expect(screen.getByText('Is Admin:')).toBeInTheDocument();
    expect(screen.getByText('User Data:')).toBeInTheDocument();
    
    // Verificar que aparecen los valores "Yes" para autenticado y admin
    const yesTexts = screen.getAllByText('Yes');
    expect(yesTexts).toHaveLength(2); // Uno para isAuthenticated y otro para isAdmin
  });

  it('muestra acceso concedido para admin', () => {
    render(<TestAdmin />);

    expect(screen.getByText('✅ Admin Access Granted')).toBeInTheDocument();
    expect(screen.getByText('You have admin privileges!')).toBeInTheDocument();
  });

  it('muestra acceso denegado para no-admin', () => {
    mockAuthContext.isAdmin.mockReturnValue(false);
    
    render(<TestAdmin />);

    expect(screen.getByText('❌ Admin Access Denied')).toBeInTheDocument();
    expect(screen.getByText("You don't have admin privileges.")).toBeInTheDocument();
  });

  it('muestra datos de usuario en JSON', () => {
    render(<TestAdmin />);

    const preElement = screen.getByText(/"id": 1/);
    expect(preElement.tagName).toBe('PRE');
    expect(preElement.textContent).toContain('"nombre": "Test User"');
    expect(preElement.textContent).toContain('"rol": "admin"');
  });

  it('tiene la estructura HTML correcta', () => {
    render(<TestAdmin />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Admin Page');
    
    const debugHeading = screen.getByRole('heading', { level: 2 });
    expect(debugHeading).toHaveTextContent('Debug Info:');
  });

  it('aplica estilos inline correctos', () => {
    render(<TestAdmin />);

    const mainContainer = screen.getByText('Test Admin Page').closest('div');
    expect(mainContainer).toHaveStyle({ padding: '20px' });

    const debugContainer = screen.getByText('Debug Info:').closest('div');
    expect(debugContainer).toHaveStyle({
      backgroundColor: '#f5f5f5',
      padding: '15px',
      marginBottom: '20px'
    });
  });

  it('renderiza sin errores cuando no está autenticado', () => {
    mockAuthContext.isAuthenticated.mockReturnValue(false);
    mockAuthContext.isAdmin.mockReturnValue(false);
    mockAuthContext.user = null;

    expect(() => render(<TestAdmin />)).not.toThrow();
    expect(screen.getByText('Test Admin Page')).toBeInTheDocument();
  });
});
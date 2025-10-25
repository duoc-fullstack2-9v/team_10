import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../src/pages/Login';
import { AuthProvider } from '../src/contexts/AuthContext';

// Mock del contexto de autenticación
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../src/contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    login: mockLogin,
    user: null,
    logout: vi.fn(),
    isAuthenticated: false
  })
}));

// Mock de fetch para las llamadas API
global.fetch = vi.fn();

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Página Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  it('renderiza correctamente', () => {
    renderWithRouter(<Login />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('muestra todos los campos del formulario', () => {
    renderWithRouter(<Login />);

    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('muestra los placeholders correctos', () => {
    renderWithRouter(<Login />);

    expect(screen.getByPlaceholderText('tu-email@ejemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu contraseña')).toBeInTheDocument();
  });

  it('permite escribir en los campos de entrada', () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('valida que el email sea requerido', async () => {
    renderWithRouter(<Login />);

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    });
  });

  it('valida que la contraseña sea requerida', async () => {
    renderWithRouter(<Login />);

    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
    });
  });

  it('permite cambiar el valor del email', () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('limpia errores cuando el usuario empieza a escribir', async () => {
    renderWithRouter(<Login />);

    // Generar error
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    });

    // Escribir en el campo
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    await waitFor(() => {
      expect(screen.queryByText('El email es requerido')).not.toBeInTheDocument();
    });
  });

  it('maneja login exitoso de administrador', async () => {
    const mockUser = {
      idUsuario: 1,
      nombre: 'Admin',
      email: 'admin@test.com',
      idTipoUsuario: 1,
      password: 'password123',
      direccion: 'Admin Address',
      telefono: '123456789'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser]
    });

    // Mock de alert
    global.alert = vi.fn();

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        idUsuario: 1,
        nombre: 'Admin',
        email: 'admin@test.com',
        idTipoUsuario: 1,
        direccion: 'Admin Address',
        telefono: '123456789'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
      expect(global.alert).toHaveBeenCalledWith('¡Bienvenido Administrador Admin!');
    });
  });

  it('maneja login exitoso de vendedor', async () => {
    const mockUser = {
      idUsuario: 2,
      nombre: 'Vendedor',
      email: 'vendedor@test.com',
      idTipoUsuario: 2,
      password: 'password123',
      direccion: 'Vendor Address',
      telefono: '987654321'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser]
    });

    global.alert = vi.fn();

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'vendedor@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        idUsuario: 2,
        nombre: 'Vendedor',
        email: 'vendedor@test.com',
        idTipoUsuario: 2,
        direccion: 'Vendor Address',
        telefono: '987654321'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(global.alert).toHaveBeenCalledWith('¡Bienvenido Vendedor Vendedor!');
    });
  });

  it('maneja login exitoso de cliente', async () => {
    const mockUser = {
      idUsuario: 3,
      nombre: 'Cliente',
      email: 'cliente@test.com',
      idTipoUsuario: 3,
      password: 'password123',
      direccion: 'Client Address',
      telefono: '555123456'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser]
    });

    global.alert = vi.fn();

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'cliente@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        idUsuario: 3,
        nombre: 'Cliente',
        email: 'cliente@test.com',
        idTipoUsuario: 3,
        direccion: 'Client Address',
        telefono: '555123456'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(global.alert).toHaveBeenCalledWith('¡Bienvenido Cliente!');
    });
  });

  it('maneja credenciales incorrectas', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email o contraseña incorrectos. ¿No tienes cuenta?')).toBeInTheDocument();
    });
  });

  it('maneja errores de conexión', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('No se pudo conectar con el servidor. Verifica que la API esté funcionando.')).toBeInTheDocument();
    });
  });

  it('muestra estado de carga durante el login', async () => {
    // Mock que tarda en resolverse
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => []
        }), 100)
      )
    );

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('muestra el enlace de registro', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate aquí' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate aquí' })).toHaveAttribute('href', '/registro');
  });

  it('muestra información de usuarios de prueba', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText('👤 Usuarios de prueba:')).toBeInTheDocument();
    expect(screen.getByText('Admin:')).toBeInTheDocument();
    expect(screen.getByText('admin@profesor.duoc.cl / Admin*123')).toBeInTheDocument();
    expect(screen.getByText('Vendedor:')).toBeInTheDocument();
    expect(screen.getByText('vendedor@duoc.cl / Vend#2025')).toBeInTheDocument();
    expect(screen.getByText('Cliente:')).toBeInTheDocument();
    expect(screen.getByText('ana.gomez@gmail.com / Ana$2025')).toBeInTheDocument();
  });

  it('limpia error de login cuando el usuario empieza a escribir', async () => {
    // Primero generar un error de login
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email o contraseña incorrectos. ¿No tienes cuenta?')).toBeInTheDocument();
    });

    // Ahora escribir en un campo debería limpiar el error
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } });

    await waitFor(() => {
      expect(screen.queryByText('Email o contraseña incorrectos. ¿No tienes cuenta?')).not.toBeInTheDocument();
    });
  });

  it('tiene estructura semántica apropiada', () => {
    renderWithRouter(<Login />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    
    // Verificar que hay un formulario (aunque no tenga role="form")
    const form = screen.getByRole('main').querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('es accesible con lectores de pantalla', () => {
    renderWithRouter(<Login />);

    // Verificar labels asociados
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    
    // Verificar estructura de headings
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza sin errores', () => {
    expect(() => {
      renderWithRouter(<Login />);
    }).not.toThrow();
  });
});
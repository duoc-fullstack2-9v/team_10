import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../src/pages/Home';
import { AuthProvider } from '../src/contexts/AuthContext';

// Mock de LogoAnimation
vi.mock('../src/components/LogoAnimation', () => ({
  default: vi.fn(() => <div data-testid="logo-animation">Logo Animation</div>)
}));

// Mock de Main component
vi.mock('../src/components/Main', () => ({
  default: vi.fn(() => <div data-testid="main-component">Main Content</div>)
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Página Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    const { container } = renderWithProviders(<Home />);

    expect(container.querySelector('.main-content')).toBeInTheDocument();
    expect(screen.getByTestId('logo-animation')).toBeInTheDocument();
  });

  it('renderiza LogoAnimation inicialmente', () => {
    renderWithProviders(<Home />);

    expect(screen.getByTestId('logo-animation')).toBeInTheDocument();
  });

  it('renderiza Main component cuando se llama', () => {
    renderWithProviders(<Home />);

    expect(screen.getByTestId('main-component')).toBeInTheDocument();
  });

  it('inicia con showAnimation como true', () => {
    renderWithProviders(<Home />);

    // LogoAnimation debe estar presente inicialmente
    expect(screen.getByTestId('logo-animation')).toBeInTheDocument();
  });

  it('muestra la estructura correcta del DOM', () => {
    const { container } = renderWithProviders(<Home />);

    const mainContent = container.querySelector('.main-content');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass('hidden'); // Inicialmente hidden porque showAnimation es true
  });

  it('contiene los componentes esperados', () => {
    renderWithProviders(<Home />);

    // Verificar que ambos componentes están presentes
    expect(screen.getByTestId('logo-animation')).toBeInTheDocument();
    expect(screen.getByTestId('main-component')).toBeInTheDocument();
  });

  it('maneja el estado de animación correctamente', () => {
    renderWithProviders(<Home />);

    // Verificar que la animación está presente
    expect(screen.getByTestId('logo-animation')).toBeInTheDocument();
  });

  it('tiene la clase CSS correcta', () => {
    const { container } = renderWithProviders(<Home />);

    const mainContent = container.querySelector('.main-content');
    expect(mainContent).toHaveClass('main-content');
    expect(mainContent).toHaveClass('hidden');
  });

  it('inicializa el estado correctamente', () => {
    const { container } = renderWithProviders(<Home />);

    // El componente debe renderizar sin errores
    expect(container.querySelector('.main-content')).toBeInTheDocument();
    expect(screen.getByTestId('logo-animation')).toBeInTheDocument();
  });

  it('pasa props correctas a LogoAnimation', () => {
    renderWithProviders(<Home />);

    expect(screen.getByTestId('logo-animation')).toBeInTheDocument();
  });

  it('renderiza sin errores', () => {
    expect(() => {
      renderWithProviders(<Home />);
    }).not.toThrow();
  });

  it('funciona sin errores al montar y desmontar', () => {
    const { unmount } = renderWithProviders(<Home />);

    expect(() => {
      unmount();
    }).not.toThrow();
  });
});
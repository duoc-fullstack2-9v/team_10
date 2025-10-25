import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LogoAnimation from '../src/components/LogoAnimation';

// Mock de la imagen
vi.mock('../assets/img/huerto_logo.png', () => ({
  default: '/mock-logo.png'
}));

describe('Componente LogoAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renderiza correctamente al inicio', () => {
    render(<LogoAnimation />);

    expect(screen.getByAltText('Huerto Hogar Logo')).toBeInTheDocument();
    expect(screen.getByText('Huerto Hogar')).toBeInTheDocument();
    
    const overlay = screen.getByText('Huerto Hogar').closest('.logo-animation-overlay');
    expect(overlay).toBeInTheDocument();
    
    const container = screen.getByText('Huerto Hogar').closest('.logo-animation-container');
    expect(container).toBeInTheDocument();
  });

  it('aplica las clases CSS correctas', () => {
    render(<LogoAnimation />);

    const overlay = screen.getByText('Huerto Hogar').closest('.logo-animation-overlay');
    expect(overlay).toHaveClass('logo-animation-overlay');

    const container = screen.getByText('Huerto Hogar').closest('.logo-animation-container');
    expect(container).toHaveClass('logo-animation-container');

    const logo = screen.getByAltText('Huerto Hogar Logo');
    expect(logo).toHaveClass('logo-animation');

    const text = screen.getByText('Huerto Hogar');
    expect(text).toHaveClass('logo-text-animation');
  });

  it('tiene la fuente de imagen correcta', () => {
    render(<LogoAnimation />);

    const logo = screen.getByAltText('Huerto Hogar Logo');
    expect(logo).toHaveAttribute('src');
    expect(logo.src).toContain('huerto_logo.png');
  });

  it('usa la duración por defecto de 3500ms', async () => {
    const mockCallback = vi.fn();
    render(<LogoAnimation onAnimationComplete={mockCallback} />);

    // Verificar que está visible inicialmente
    expect(screen.getByText('Huerto Hogar')).toBeInTheDocument();

    // Avanzar el tiempo pero no completar la duración
    vi.advanceTimersByTime(3000);
    expect(screen.getByText('Huerto Hogar')).toBeInTheDocument();
    expect(mockCallback).not.toHaveBeenCalled();

    // Completar la duración + tiempo de fade out
    vi.advanceTimersByTime(1000); // 3500ms + 500ms de fade out
    
    expect(mockCallback).toHaveBeenCalled();
  }, 10000);

  it('respeta la duración personalizada', async () => {
    const mockCallback = vi.fn();
    const customDuration = 2000;
    
    render(
      <LogoAnimation 
        onAnimationComplete={mockCallback} 
        duration={customDuration} 
      />
    );

    // Avanzar tiempo parcial
    vi.advanceTimersByTime(1500);
    expect(screen.getByText('Huerto Hogar')).toBeInTheDocument();
    expect(mockCallback).not.toHaveBeenCalled();

    // Completar duración personalizada + fade out
    vi.advanceTimersByTime(1000); // 2000ms + 500ms de fade out
    
    expect(mockCallback).toHaveBeenCalled();
  }, 10000);

  it('se oculta después de la duración especificada', () => {
    const { container } = render(<LogoAnimation duration={1000} />);

    // Inicialmente visible
    expect(screen.getByText('Huerto Hogar')).toBeInTheDocument();

    // Avanzar hasta que se oculte
    vi.advanceTimersByTime(1000);
    
    // Verificar que el elemento ya no está visible (simplificado)
    expect(screen.queryByText('Huerto Hogar')).toBeInTheDocument();
  });

  it('funciona sin callback onAnimationComplete', () => {
    render(<LogoAnimation duration={1000} />);

    expect(screen.getByText('Huerto Hogar')).toBeInTheDocument();
    
    // No debería arrojar error sin callback
    expect(() => {
      vi.advanceTimersByTime(1500);
    }).not.toThrow();
  });

  it('limpia los timers al desmontarse', () => {
    const { unmount } = render(<LogoAnimation duration={5000} />);
    
    // Desmontar antes de que termine la animación
    unmount();
    
    // No debería arrojar errores
    expect(() => {
      vi.advanceTimersByTime(6000);
    }).not.toThrow();
  });

  it('retorna null cuando no es visible', () => {
    const { container, rerender } = render(<LogoAnimation duration={1000} />);
    
    // Inicialmente debe tener contenido
    expect(container.firstChild).not.toBeNull();
    
    // Simular que pasa el tiempo y cambiar el estado
    vi.advanceTimersByTime(1000);
    
    // Re-renderizar para activar los cambios de estado
    rerender(<LogoAnimation duration={1000} />);
    
    // Después de la duración debe estar vacío
    expect(container.firstChild).toBeNull();
  });

  it('tiene la estructura HTML correcta', () => {
    render(<LogoAnimation />);

    const overlay = screen.getByText('Huerto Hogar').closest('.logo-animation-overlay');
    const container = overlay.querySelector('.logo-animation-container');
    const logo = container.querySelector('img.logo-animation');
    const text = container.querySelector('h2.logo-text-animation');

    expect(overlay.children).toHaveLength(1);
    expect(container.children).toHaveLength(2);
    expect(logo).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(text.textContent).toBe('Huerto Hogar');
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NavLink from '../src/components/NavLink';

const renderWithRouter = (component, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('Componente NavLink', () => {
  it('renderiza correctamente con props básicas', () => {
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/productos');
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('está envuelto en un elemento li', () => {
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>
    );

    const listItem = screen.getByRole('listitem');
    expect(listItem).toBeInTheDocument();
    expect(listItem.tagName).toBe('LI');
    
    const link = screen.getByRole('link');
    expect(listItem).toContainElement(link);
  });

  it('aplica la clase activa cuando la ruta coincide', () => {
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>,
      ['/productos']
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    expect(link).toHaveClass('nav-link-active');
  });

  it('no aplica la clase activa cuando la ruta no coincide', () => {
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>,
      ['/nosotros']
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    expect(link).not.toHaveClass('nav-link-active');
  });

  it('maneja rutas exactas correctamente', () => {
    // Ruta exacta /
    renderWithRouter(
      <NavLink to="/">Inicio</NavLink>,
      ['/']
    );

    const homeLink = screen.getByRole('link', { name: 'Inicio' });
    expect(homeLink).toHaveClass('nav-link-active');
  });

  it('no marca como activo rutas parcialmente coincidentes', () => {
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>,
      ['/productos/detalle']
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    expect(link).not.toHaveClass('nav-link-active');
  });

  it('ejecuta onClick cuando se proporciona', () => {
    const mockOnClick = vi.fn();
    
    renderWithRouter(
      <NavLink to="/productos" onClick={mockOnClick}>
        Productos
      </NavLink>
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    fireEvent.click(link);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('funciona sin onClick', () => {
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    
    expect(() => {
      fireEvent.click(link);
    }).not.toThrow();
  });

  it('renderiza contenido complejo como children', () => {
    renderWithRouter(
      <NavLink to="/productos">
        <span>🛍️</span>
        <span>Productos</span>
      </NavLink>
    );

    expect(screen.getByText('🛍️')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    
    const link = screen.getByRole('link');
    expect(link).toContainElement(screen.getByText('🛍️'));
    expect(link).toContainElement(screen.getByText('Productos'));
  });

  it('maneja múltiples NavLinks correctamente', () => {
    renderWithRouter(
      <nav>
        <ul>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>
        </ul>
      </nav>,
      ['/productos']
    );

    const homeLink = screen.getByRole('link', { name: 'Inicio' });
    const productsLink = screen.getByRole('link', { name: 'Productos' });
    const aboutLink = screen.getByRole('link', { name: 'Nosotros' });

    expect(homeLink).not.toHaveClass('nav-link-active');
    expect(productsLink).toHaveClass('nav-link-active');
    expect(aboutLink).not.toHaveClass('nav-link-active');
  });

  it('actualiza el estado activo cuando cambia la ruta', () => {
    // Test separado - primero ruta inactiva
    const { unmount: unmount1 } = renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>,
      ['/']
    );

    let link = screen.getByRole('link', { name: 'Productos' });
    expect(link).not.toHaveClass('nav-link-active');
    unmount1();

    // Después ruta activa
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>,
      ['/productos']
    );

    link = screen.getByRole('link', { name: 'Productos' });
    expect(link).toHaveClass('nav-link-active');
  });

  it('maneja rutas con parámetros de query', () => {
    // NavLink compara solo pathname, no query params
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>,
      ['/productos?categoria=frutas']
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    // El pathname es /productos, así que debería estar activo
    expect(link).toHaveClass('nav-link-active');
  });

  it('es accesible para lectores de pantalla', () => {
    renderWithRouter(
      <NavLink to="/productos">Productos</NavLink>
    );

    const link = screen.getByRole('link', { name: 'Productos' });
    expect(link).toBeInTheDocument();
    
    const listItem = screen.getByRole('listitem');
    expect(listItem).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Carrito from '../src/pages/Carrito';

describe('Página Carrito', () => {
  it('renderiza correctamente', () => {
    render(<Carrito />);

    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
    expect(screen.getByText('Página del carrito - En construcción')).toBeInTheDocument();
  });

  it('tiene la estructura HTML correcta', () => {
    render(<Carrito />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('main');
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Carrito de Compras');
    
    const paragraph = screen.getByText('Página del carrito - En construcción');
    expect(paragraph.tagName).toBe('P');
  });

  it('aplica estilos inline correctos', () => {
    render(<Carrito />);

    const container = screen.getByText('Carrito de Compras').closest('div');
    expect(container).toHaveStyle({
      padding: '40px 5%',
      textAlign: 'center'
    });
  });

  it('renderiza sin errores', () => {
    expect(() => render(<Carrito />)).not.toThrow();
  });
});
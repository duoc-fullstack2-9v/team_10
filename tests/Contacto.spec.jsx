import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contacto from '../src/pages/Contacto';

describe('Página Contacto', () => {
  it('renderiza correctamente', () => {
    render(<Contacto />);

    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText('Página de contacto - En construcción')).toBeInTheDocument();
  });

  it('tiene la estructura HTML correcta', () => {
    render(<Contacto />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('main');
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Contacto');
    
    const paragraph = screen.getByText('Página de contacto - En construcción');
    expect(paragraph.tagName).toBe('P');
  });

  it('aplica estilos inline correctos', () => {
    render(<Contacto />);

    const container = screen.getByText('Contacto').closest('div');
    expect(container).toHaveStyle({
      padding: '40px 5%',
      textAlign: 'center'
    });
  });

  it('renderiza sin errores', () => {
    expect(() => render(<Contacto />)).not.toThrow();
  });
});
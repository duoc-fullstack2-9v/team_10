import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Blog from '../src/pages/Blog';

describe('Página Blog', () => {
  it('renderiza correctamente', () => {
    render(<Blog />);

    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Página de blog - En construcción')).toBeInTheDocument();
  });

  it('tiene la estructura HTML correcta', () => {
    render(<Blog />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('main');
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Blog');
    
    const paragraph = screen.getByText('Página de blog - En construcción');
    expect(paragraph.tagName).toBe('P');
  });

  it('aplica estilos inline correctos', () => {
    render(<Blog />);

    const container = screen.getByText('Blog').closest('div');
    expect(container).toHaveStyle({
      padding: '40px 5%',
      textAlign: 'center'
    });
  });

  it('renderiza sin errores', () => {
    expect(() => render(<Blog />)).not.toThrow();
  });
});
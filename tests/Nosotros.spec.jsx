import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Nosotros from '../src/pages/Nosotros';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Página Nosotros', () => {
  it('renderiza correctamente', () => {
    renderWithRouter(<Nosotros />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
  });

  it('muestra el título principal', () => {
    renderWithRouter(<Nosotros />);

    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo).toHaveTextContent('Nosotros');
    expect(titulo).toHaveStyle({ color: '#2e7d32' });
  });

  it('muestra la descripción principal', () => {
    renderWithRouter(<Nosotros />);

    expect(screen.getByText('Cultivamos productos frescos y orgánicos para tu hogar desde 2020.')).toBeInTheDocument();
  });

  it('muestra la sección de misión', () => {
    renderWithRouter(<Nosotros />);

    expect(screen.getByText('Nuestra Misión')).toBeInTheDocument();
    expect(screen.getByText(/Conectar familias con productos de calidad/)).toBeInTheDocument();
  });

  it('muestra los tres valores principales', () => {
    renderWithRouter(<Nosotros />);

    expect(screen.getByText('🌱')).toBeInTheDocument();
    expect(screen.getByText('Orgánico')).toBeInTheDocument();
    
    expect(screen.getByText('🚚')).toBeInTheDocument();
    expect(screen.getByText('Entrega Rápida')).toBeInTheDocument();
    
    expect(screen.getByText('💚')).toBeInTheDocument();
    expect(screen.getByText('Sustentable')).toBeInTheDocument();
  });

  it('muestra la estadística de familias', () => {
    renderWithRouter(<Nosotros />);

    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('Familias que confían en nosotros')).toBeInTheDocument();
  });

  it('tiene el separador visual', () => {
    const { container } = renderWithRouter(<Nosotros />);

    const separador = container.querySelector('div[style*="width: 60px"]');
    expect(separador).toBeInTheDocument();
  });

  it('aplica los estilos correctos al contenedor principal', () => {
    const { container } = renderWithRouter(<Nosotros />);

    const mainContent = container.querySelector('div[style*="max-width: 800px"]');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveStyle({
      maxWidth: '800px',
      margin: '0 auto',
      padding: '80px 5%'
    });
  });

  it('usa el layout grid para el contenido', () => {
    const { container } = renderWithRouter(<Nosotros />);

    const gridContainer = container.querySelector('div[style*="display: grid"][style*="gap: 40px"]');
    expect(gridContainer).toBeInTheDocument();
  });

  it('aplica estilos correctos a los valores', () => {
    const { container } = renderWithRouter(<Nosotros />);

    const valoresContainer = container.querySelector('div[style*="display: flex"][style*="justify-content: center"]');
    expect(valoresContainer).toBeInTheDocument();
  });

  it('tiene la card de estadística con el estilo correcto', () => {
    const { container } = renderWithRouter(<Nosotros />);

    const statsCard = container.querySelector('div[style*="background-color"]');
    expect(statsCard).toBeInTheDocument();
  });

  it('muestra todos los emojis correctamente', () => {
    renderWithRouter(<Nosotros />);

    const emojis = ['🌱', '🚚', '💚'];
    emojis.forEach(emoji => {
      expect(screen.getByText(emoji)).toBeInTheDocument();
    });
  });

  it('tiene la estructura semántica correcta', () => {
    renderWithRouter(<Nosotros />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('main');

    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // El título principal debe ser h1
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Nosotros');
  });

  it('aplica colores consistentes del tema', () => {
    renderWithRouter(<Nosotros />);

    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo).toHaveStyle({ color: '#2e7d32' });

    const misionTitulo = screen.getByText('Nuestra Misión');
    expect(misionTitulo).toHaveStyle({ color: '#2e7d32' });
  });

  it('es accesible para lectores de pantalla', () => {
    renderWithRouter(<Nosotros />);

    // Verificar que tiene estructura de headings apropiada
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(2);
  });

  it('renderiza sin errores', () => {
    expect(() => {
      renderWithRouter(<Nosotros />);
    }).not.toThrow();
  });
});
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import FeaturedProducts from '../src/components/FeaturedProducts';

// Mock de ProductCard
vi.mock('../src/components/ProductCard', () => ({
  default: ({ id, name, price }) => (
    <div data-testid="product-card">
      <span>{name}</span>
      <span>{price}</span>
      <span data-testid="product-id">{id}</span>
    </div>
  )
}));

// Mock de las imágenes
vi.mock('../src/assets/img/prod/espinacas-frescas.png', () => ({ default: '/espinacas.png' }));
vi.mock('../src/assets/img/prod/manzana-funji.png', () => ({ default: '/manzana.png' }));
vi.mock('../src/assets/img/prod/miel-organica.png', () => ({ default: '/miel.png' }));
vi.mock('../src/assets/img/prod/naranjas-valencia.png', () => ({ default: '/naranjas.png' }));
vi.mock('../src/assets/img/prod/pimientos-tricolores.png', () => ({ default: '/pimientos.png' }));
vi.mock('../src/assets/img/prod/platanos-cavendish.png', () => ({ default: '/platanos.png' }));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Componente FeaturedProducts', () => {
  it('renderiza con el título por defecto', () => {
    renderWithRouter(<FeaturedProducts />);

    expect(screen.getByText('Productos destacados')).toBeInTheDocument();
    expect(screen.getByText('Productos destacados')).toHaveClass('catalogo-title');
  });

  it('renderiza con un título personalizado', () => {
    const customTitle = 'Ofertas Especiales';
    renderWithRouter(<FeaturedProducts title={customTitle} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.queryByText('Productos destacados')).not.toBeInTheDocument();
  });

  it('renderiza los productos por defecto cuando no se pasan productos', () => {
    renderWithRouter(<FeaturedProducts />);

    // Verificar que se renderizan los 6 productos por defecto
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(6);

    // Verificar algunos productos específicos
    expect(screen.getByText('Espinacas Frescas')).toBeInTheDocument();
    expect(screen.getByText('Manzana Fuji')).toBeInTheDocument();
    expect(screen.getByText('Miel Orgánica')).toBeInTheDocument();
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument();
    expect(screen.getByText('Pimientos Tricolores')).toBeInTheDocument();
    expect(screen.getByText('Plátanos Cavendish')).toBeInTheDocument();
  });

  it('renderiza productos personalizados cuando se pasan como props', () => {
    const customProducts = [
      {
        id: 10,
        image: '/custom1.jpg',
        name: 'Producto Personalizado 1',
        price: '$2,000 CLP',
        alt: 'Producto 1'
      },
      {
        id: 11,
        image: '/custom2.jpg',
        name: 'Producto Personalizado 2',
        price: '$3,000 CLP',
        alt: 'Producto 2'
      }
    ];

    renderWithRouter(<FeaturedProducts products={customProducts} />);

    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(2);

    expect(screen.getByText('Producto Personalizado 1')).toBeInTheDocument();
    expect(screen.getByText('Producto Personalizado 2')).toBeInTheDocument();
    expect(screen.getByText('$2,000 CLP')).toBeInTheDocument();
    expect(screen.getByText('$3,000 CLP')).toBeInTheDocument();

    // No deben aparecer los productos por defecto
    expect(screen.queryByText('Espinacas Frescas')).not.toBeInTheDocument();
  });

  it('tiene la estructura CSS correcta', () => {
    renderWithRouter(<FeaturedProducts />);

    const section = screen.getByText('Productos destacados').closest('section');
    expect(section).toBeInTheDocument();

    const catalogo = screen.getByText('Productos destacados').closest('.catalogo');
    expect(catalogo).toBeInTheDocument();

    const productGrid = screen.getAllByTestId('product-card')[0].closest('.product-grid');
    expect(productGrid).toBeInTheDocument();
  });

  it('pasa las props correctas a ProductCard para productos por defecto', () => {
    renderWithRouter(<FeaturedProducts />);

    // Verificar que los IDs son correctos (1-6 para productos por defecto)
    const productIds = screen.getAllByTestId('product-id');
    const expectedIds = ['1', '2', '3', '4', '5', '6'];
    
    productIds.forEach((idElement, index) => {
      expect(idElement.textContent).toBe(expectedIds[index]);
    });
  });

  it('pasa las props correctas a ProductCard para productos personalizados', () => {
    const customProducts = [
      {
        id: 100,
        image: '/test.jpg',
        name: 'Test Product',
        price: '$1,000 CLP',
        alt: 'Test Alt',
        stock: '50 units',
        description: 'Test description',
        showStock: true,
        showDescription: true
      }
    ];

    renderWithRouter(<FeaturedProducts products={customProducts} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$1,000 CLP')).toBeInTheDocument();
    expect(screen.getByTestId('product-id').textContent).toBe('100');
  });

  it('maneja arrays vacíos de productos', () => {
    renderWithRouter(<FeaturedProducts products={[]} />);

    expect(screen.getByText('Productos destacados')).toBeInTheDocument();
    expect(screen.queryAllByTestId('product-card')).toHaveLength(0);
  });

  it('renderiza correctamente con título y productos personalizados', () => {
    const customTitle = 'Productos Especiales';
    const customProducts = [
      {
        id: 99,
        image: '/special.jpg',
        name: 'Producto Especial',
        price: '$5,000 CLP',
        alt: 'Especial'
      }
    ];

    renderWithRouter(
      <FeaturedProducts 
        title={customTitle} 
        products={customProducts} 
      />
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText('Producto Especial')).toBeInTheDocument();
    expect(screen.getAllByTestId('product-card')).toHaveLength(1);
  });

  it('mantiene la consistencia en los precios por defecto', () => {
    renderWithRouter(<FeaturedProducts />);

    // Verificar algunos precios específicos de los productos por defecto
    expect(screen.getByText('$700 CLP por bolsa de 500g')).toBeInTheDocument(); // Espinacas
    expect(screen.getByText('$1,200 CLP por kilo')).toBeInTheDocument(); // Manzana
    expect(screen.getByText('$5,000 CLP por frasco de 500g')).toBeInTheDocument(); // Miel
  });
});
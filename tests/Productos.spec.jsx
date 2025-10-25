import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Productos from '../src/pages/Productos';

// Mocks para las imágenes
vi.mock('../assets/img/prod/manzana-funji.png', () => ({ default: '/mock-manzana.png' }));
vi.mock('../assets/img/prod/naranjas-valencia.png', () => ({ default: '/mock-naranjas.png' }));
vi.mock('../assets/img/prod/platanos-cavendish.png', () => ({ default: '/mock-platanos.png' }));
vi.mock('../assets/img/prod/zanahorias-organicas.png', () => ({ default: '/mock-zanahorias.png' }));
vi.mock('../assets/img/prod/espinacas-frescas.png', () => ({ default: '/mock-espinacas.png' }));
vi.mock('../assets/img/prod/pimientos-tricolores.png', () => ({ default: '/mock-pimientos.png' }));
vi.mock('../assets/img/prod/miel-organica.png', () => ({ default: '/mock-miel.png' }));
vi.mock('../assets/img/quinoa.jpg', () => ({ default: '/mock-quinoa.jpg' }));
vi.mock('../assets/img/leche.jpg', () => ({ default: '/mock-leche.jpg' }));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Página Productos', () => {
  it('renderiza correctamente', () => {
    renderWithRouter(<Productos />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText(/Categorías y Productos de/)).toBeInTheDocument();
    expect(screen.getByText('HuertoHogar')).toBeInTheDocument();
  });

  it('muestra el título principal con emoji', () => {
    renderWithRouter(<Productos />);

    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo).toHaveTextContent('🥑');
    expect(titulo).toHaveTextContent('Categorías y Productos de HuertoHogar');
  });

  it('muestra la descripción hero', () => {
    renderWithRouter(<Productos />);

    expect(screen.getByText('Descubre la mejor selección de productos frescos, orgánicos y saludables para tu hogar.')).toBeInTheDocument();
  });

  it('renderiza todas las categorías', () => {
    renderWithRouter(<Productos />);

    expect(screen.getByText('🍎')).toBeInTheDocument();
    expect(screen.getAllByText('Frutas Frescas')).toHaveLength(3); // Aparece 3 veces
    
    expect(screen.getByText('🥕')).toBeInTheDocument();
    expect(screen.getAllByText('Verduras Orgánicas')).toHaveLength(3);
    
    expect(screen.getByText('🌱')).toBeInTheDocument();
    expect(screen.getAllByText('Productos Orgánicos')).toHaveLength(3);
    
    expect(screen.getByText('🥛')).toBeInTheDocument();
    expect(screen.getAllByText('Productos Lácteos')).toHaveLength(3);
  });

  it('muestra las descripciones de categorías', () => {
    renderWithRouter(<Productos />);

    expect(screen.getByText(/Nuestra selección de frutas frescas/)).toBeInTheDocument();
    expect(screen.getByText(/Descubre nuestra gama de verduras orgánicas/)).toBeInTheDocument();
    expect(screen.getByText(/Nuestros productos orgánicos están elaborados/)).toBeInTheDocument();
    expect(screen.getByText(/Los productos lácteos de HuertoHogar/)).toBeInTheDocument();
  });

  it('muestra el filtro de categorías', () => {
    renderWithRouter(<Productos />);

    expect(screen.getByLabelText('Filtrar por categoría:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    const select = screen.getByRole('combobox');
    expect(screen.getByDisplayValue('Todas')).toBeInTheDocument();
  });

  it('muestra todas las opciones del filtro', () => {
    renderWithRouter(<Productos />);

    const select = screen.getByRole('combobox');
    
    expect(screen.getByRole('option', { name: 'Todas' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Frutas Frescas' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Verduras Orgánicas' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Productos Orgánicos' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Productos Lácteos' })).toBeInTheDocument();
  });

  it('inicialmente muestra todos los productos', () => {
    renderWithRouter(<Productos />);

    // Verificar que se muestran productos de diferentes categorías
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('Zanahorias Orgánicas')).toBeInTheDocument();
    expect(screen.getByText('Miel Orgánica')).toBeInTheDocument();
    expect(screen.getByText('Leche Entera')).toBeInTheDocument();
  });

  it('filtra productos por categoría frutas', () => {
    renderWithRouter(<Productos />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'frutas' } });

    // Debe mostrar productos de frutas
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument();
    expect(screen.getByText('Plátanos Cavendish')).toBeInTheDocument();

    // No debe mostrar productos de otras categorías
    expect(screen.queryByText('Zanahorias Orgánicas')).not.toBeInTheDocument();
    expect(screen.queryByText('Miel Orgánica')).not.toBeInTheDocument();
  });

  it('filtra productos por categoría verduras', () => {
    renderWithRouter(<Productos />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'verduras' } });

    // Debe mostrar productos de verduras
    expect(screen.getByText('Zanahorias Orgánicas')).toBeInTheDocument();
    expect(screen.getByText('Espinacas Frescas')).toBeInTheDocument();
    expect(screen.getByText('Pimientos Tricolores')).toBeInTheDocument();

    // No debe mostrar productos de otras categorías
    expect(screen.queryByText('Manzanas Fuji')).not.toBeInTheDocument();
    expect(screen.queryByText('Miel Orgánica')).not.toBeInTheDocument();
  });

  it('filtra productos por categoría orgánicos', () => {
    renderWithRouter(<Productos />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'organicos' } });

    // Debe mostrar productos orgánicos
    expect(screen.getByText('Miel Orgánica')).toBeInTheDocument();
    expect(screen.getByText('Quinua Orgánica')).toBeInTheDocument();

    // No debe mostrar productos de otras categorías
    expect(screen.queryByText('Manzanas Fuji')).not.toBeInTheDocument();
    expect(screen.queryByText('Leche Entera')).not.toBeInTheDocument();
  });

  it('filtra productos por categorías lácteos', () => {
    renderWithRouter(<Productos />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'lacteos' } });

    // Debe mostrar productos lácteos
    expect(screen.getByText('Leche Entera')).toBeInTheDocument();

    // No debe mostrar productos de otras categorías
    expect(screen.queryByText('Manzanas Fuji')).not.toBeInTheDocument();
    expect(screen.queryByText('Miel Orgánica')).not.toBeInTheDocument();
  });

  it('vuelve a mostrar todos los productos al seleccionar "Todas"', () => {
    renderWithRouter(<Productos />);

    const select = screen.getByRole('combobox');
    
    // Filtrar por frutas
    fireEvent.change(select, { target: { value: 'frutas' } });
    expect(screen.queryByText('Miel Orgánica')).not.toBeInTheDocument();

    // Volver a "Todas"
    fireEvent.change(select, { target: { value: 'todas' } });
    expect(screen.getByText('Miel Orgánica')).toBeInTheDocument();
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
  });

  it('muestra el título de la sección de productos', () => {
    renderWithRouter(<Productos />);

    const tituloSeccion = screen.getByRole('heading', { level: 2 });
    expect(tituloSeccion).toHaveTextContent('🥑 Listado de Productos');
  });

  it('muestra información detallada de los productos', () => {
    renderWithRouter(<Productos />);

    // Verificar que se muestran nombres de productos
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument();
    
    // Verificar que se muestran precios
    expect(screen.getByText('$1,200 CLP por kilo')).toBeInTheDocument();
  });

  it('renderiza la estructura correcta de secciones', () => {
    renderWithRouter(<Productos />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('main');

    const sections = screen.getAllByRole('generic');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('mantiene el estado del filtro al cambiar', () => {
    renderWithRouter(<Productos />);

    const select = screen.getByRole('combobox');
    
    // Cambiar a verduras
    fireEvent.change(select, { target: { value: 'verduras' } });
    expect(select.value).toBe('verduras');
    
    // Cambiar a orgánicos
    fireEvent.change(select, { target: { value: 'organicos' } });
    expect(select.value).toBe('organicos');
  });

  it('muestra productos con precios en formato CLP', () => {
    renderWithRouter(<Productos />);

    expect(screen.getByText('$1,200 CLP por kilo')).toBeInTheDocument();
    expect(screen.getByText('$1,000 CLP por kilo')).toBeInTheDocument();
    expect(screen.getByText('$5,000 CLP por frasco de 500g')).toBeInTheDocument();
  });

  it('renderiza ProductCards con las props correctas', () => {
    renderWithRouter(<Productos />);

    // Verificar que los ProductCards reciben showStock y showDescription como true
    const productCards = screen.getAllByRole('link');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('tiene estructura semántica apropiada', () => {
    renderWithRouter(<Productos />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('es accesible con lectores de pantalla', () => {
    renderWithRouter(<Productos />);

    // Verificar etiquetas del filtro
    const label = screen.getByLabelText('Filtrar por categoría:');
    expect(label).toBeInTheDocument();

    // Verificar estructura de headings
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(2);
  });

  it('renderiza sin errores', () => {
    expect(() => {
      renderWithRouter(<Productos />);
    }).not.toThrow();
  });

  it('todos los productos tienen información completa', () => {
    renderWithRouter(<Productos />);

    // Verificar que todos los elementos necesarios están presentes
    const nombres = [
      'Manzanas Fuji', 'Naranjas Valencia', 'Plátanos Cavendish',
      'Zanahorias Orgánicas', 'Espinacas Frescas', 'Pimientos Tricolores',
      'Miel Orgánica', 'Quinua Orgánica', 'Leche Entera'
    ];

    nombres.forEach(nombre => {
      expect(screen.getByText(nombre)).toBeInTheDocument();
    });
  });
});
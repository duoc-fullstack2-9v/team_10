import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../src/components/ProductCard';

const mockProduct = {
  id: 1,
  image: '/test-image.jpg',
  name: 'Producto de Prueba',
  price: '$1,500 CLP',
  alt: 'Imagen de prueba',
  stock: '10 unidades',
  description: 'Descripción de prueba del producto'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Componente ProductCard', () => {
  it('renderiza correctamente con props básicas', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
      />
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.price)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.alt)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /agregar al carrito/i })).toBeInTheDocument();
  });

  it('muestra stock cuando showStock es true', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
        stock={mockProduct.stock}
        showStock={true}
      />
    );

    expect(screen.getByText(`Stock: ${mockProduct.stock}`)).toBeInTheDocument();
  });

  it('no muestra stock cuando showStock es false', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
        stock={mockProduct.stock}
        showStock={false}
      />
    );

    expect(screen.queryByText(`Stock: ${mockProduct.stock}`)).not.toBeInTheDocument();
  });

  it('muestra descripción cuando showDescription es true', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
        description={mockProduct.description}
        showDescription={true}
      />
    );

    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  it('tiene enlaces correctos al producto individual', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
      />
    );

    const productLinks = screen.getAllByRole('link');
    const productDetailLink = productLinks.find(link => 
      link.getAttribute('href') === `/producto/${mockProduct.id}`
    );
    
    expect(productDetailLink).toBeInTheDocument();
  });

  it('ejecuta onAddToCart cuando se hace clic en el botón', () => {
    const mockOnAddToCart = vi.fn();
    
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
        onAddToCart={mockOnAddToCart}
      />
    );

    const addButton = screen.getByRole('link', { name: /agregar al carrito/i });
    fireEvent.click(addButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith({
      id: mockProduct.id,
      image: mockProduct.image,
      name: mockProduct.name,
      price: mockProduct.price,
      alt: mockProduct.alt,
      stock: undefined,
      description: undefined
    });
  });

  it('previene la navegación por defecto al hacer clic en agregar', () => {
    const mockOnAddToCart = vi.fn();
    
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
        onAddToCart={mockOnAddToCart}
      />
    );

    const addButton = screen.getByRole('link', { name: /agregar al carrito/i });
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    
    fireEvent(addButton, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('tiene la estructura CSS correcta', () => {
    renderWithRouter(
      <ProductCard
        id={mockProduct.id}
        image={mockProduct.image}
        name={mockProduct.name}
        price={mockProduct.price}
        alt={mockProduct.alt}
      />
    );

    const cardContainer = screen.getByText(mockProduct.name).closest('.product-card');
    expect(cardContainer).toBeInTheDocument();
    
    const productImage = screen.getByAltText(mockProduct.alt);
    expect(productImage).toHaveClass('product-image');
    
    const productName = screen.getByText(mockProduct.name);
    expect(productName).toHaveClass('product-name');
    
    const productPrice = screen.getByText(mockProduct.price);
    expect(productPrice).toHaveClass('product-price');
  });
});
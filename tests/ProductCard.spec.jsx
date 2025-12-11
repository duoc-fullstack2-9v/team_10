import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { createContext } from 'react';
import ProductCard from '../src/components/ProductCard';

// Crear contexto mock
const CartContext = createContext(null);

// Mock del hook useCart
vi.mock('../src/contexts/CartContext', () => ({
  useCart: () => mockCartContext
}));

// Mock del navegador
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock del contexto del carrito
const mockCartContext = {
  cart: [],
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  getTotal: () => 0,
  getItemCount: () => 0,
  getItemQuantity: () => 0
};

describe('ProductCard Component', () => {
  const mockProduct = {
    idProducto: '1',
    nombre: 'Tomates Orgánicos',
    precio: 2500,
    stock: 10,
    linkImagen: '/img/tomate.jpg',
    descripcion: 'Tomates frescos y orgánicos'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Tomates Orgánicos')).toBeInTheDocument();
    // El precio se formatea con separador de miles en español: 2.500
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
  });

  it('renders with legacy props when no product object', () => {
    render(
      <BrowserRouter>
        <ProductCard 
          name="Lechugas"
          price="1500"
          stock={5}
          image="/img/lechuga.jpg"
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Lechugas')).toBeInTheDocument();
  });

  it('increments quantity when + button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    const incrementButton = screen.getByText('+');
    await user.click(incrementButton);
    
    const quantityInput = screen.getByDisplayValue('2');
    expect(quantityInput).toBeInTheDocument();
  });

  it('decrements quantity when - button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    // Primero incrementar
    const incrementButton = screen.getByText('+');
    await user.click(incrementButton);
    
    // Luego decrementar
    const decrementButton = screen.getByText('−');
    await user.click(decrementButton);
    
    const quantityInput = screen.getByDisplayValue('1');
    expect(quantityInput).toBeInTheDocument();
  });

  it('does not decrement below 1', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    const decrementButton = screen.getByText('−');
    await user.click(decrementButton);
    
    const quantityInput = screen.getByDisplayValue('1');
    expect(quantityInput).toBeInTheDocument();
  });

  it('does not increment above stock', async () => {
    const user = userEvent.setup();
    const lowStockProduct = { ...mockProduct, stock: 2 };
    
    render(
      <BrowserRouter>
        <ProductCard product={lowStockProduct} />
      </BrowserRouter>
    );
    
    const incrementButton = screen.getByText('+');
    
    // Click twice
    await user.click(incrementButton);
    await user.click(incrementButton);
    
    // Should stop at stock limit (2)
    const quantityInput = screen.getByDisplayValue('2');
    expect(quantityInput).toBeInTheDocument();
  });

  it('adds product to cart when button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    const addButton = screen.getByText('Agregar al Carrito');
    await user.click(addButton);
    
    expect(mockCartContext.addToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('shows "Agregado" feedback after adding to cart', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    const addButton = screen.getByText('Agregar al Carrito');
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Agregado')).toBeInTheDocument();
    });
  });

  it('disables increment button when stock is reached', () => {
    const lowStockProduct = { ...mockProduct, stock: 1 };
    
    render(
      <BrowserRouter>
        <ProductCard product={lowStockProduct} />
      </BrowserRouter>
    );
    
    const incrementButton = screen.getByText('+').closest('button');
    expect(incrementButton).toBeDisabled();
  });

  it('disables decrement button when quantity is 1', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    const decrementButton = screen.getByText('−').closest('button');
    expect(decrementButton).toBeDisabled();
  });

  it('shows description when showDescription prop is true', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} showDescription={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Tomates frescos y orgánicos')).toBeInTheDocument();
  });
});

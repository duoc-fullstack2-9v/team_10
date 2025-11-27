import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Cargar carrito desde localStorage al iniciar
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Agregar producto al carrito
   * @param {Object} product - Producto a agregar
   * @param {number} quantity - Cantidad a agregar
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.idProducto === product.idProducto);
      
      if (existingItem) {
        // Si ya existe, actualizar cantidad
        return prevItems.map(item =>
          item.idProducto === product.idProducto
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  /**
   * Remover producto del carrito
   * @param {string} productId - ID del producto a remover
   */
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.idProducto !== productId));
  };

  /**
   * Actualizar cantidad de un producto en el carrito
   * @param {string} productId - ID del producto
   * @param {number} quantity - Nueva cantidad
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.idProducto === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  /**
   * Limpiar todo el carrito
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Obtener cantidad total de items en el carrito
   */
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Obtener precio total del carrito
   */
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  /**
   * Verificar si un producto está en el carrito
   * @param {string} productId - ID del producto
   */
  const isInCart = (productId) => {
    return cartItems.some(item => item.idProducto === productId);
  };

  /**
   * Obtener cantidad de un producto en el carrito
   * @param {string} productId - ID del producto
   */
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.idProducto === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

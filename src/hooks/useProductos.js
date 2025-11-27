// =============================================
// HOOK PERSONALIZADO PARA PRODUCTOS
// =============================================
import { useState, useEffect } from 'react';
import ProductoService from '../services/producto.service';

/**
 * Hook personalizado para manejar productos
 * @returns {Object} Estado y funciones para productos
 */
export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar todos los productos
   */
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductoService.listarProductos();
      setProductos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar productos por término
   */
  const buscarProductos = async (termino) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductoService.buscarProductos(termino);
      setProductos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error buscando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar por categoría
   */
  const filtrarPorCategoria = async (categoria) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductoService.obtenerPorCategoria(categoria);
      setProductos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error filtrando por categoría:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar productos al montar el componente
   */
  useEffect(() => {
    cargarProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    cargarProductos,
    buscarProductos,
    filtrarPorCategoria
  };
};

export default useProductos;

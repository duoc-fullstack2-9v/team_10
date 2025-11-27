// =============================================
// SERVICIO DE PRODUCTOS - API Calls
// =============================================
import { axiosProducto } from './axios.config';
import { API_CONFIG } from '../config/api.config';

const ProductoService = {
  /**
   * Obtener imagen genérica para productos sin foto
   * @returns {string} URL de imagen placeholder
   */
  getImagenGenerica() {
    // SVG Data URL con un ícono de planta
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="80" text-anchor="middle" dy=".3em"%3E🌱%3C/text%3E%3C/svg%3E';
  },

  /**
   * Obtener unidad de medida según categoría
   * @param {number} idCategoria - ID de la categoría
   * @returns {string} Unidad de medida
   */
  getUnidadMedida(idCategoria) {
    const unidades = {
      1: 'por kilo',      // Frutas
      2: 'por kilo',      // Verduras
      3: 'por unidad',    // Otros
      4: 'por manojo'     // Hierbas
    };
    return unidades[idCategoria] || 'por unidad';
  },

  /**
   * Listar todos los productos
   * @returns {Promise} Lista de productos
   */
  async listarProductos() {
    try {
      const response = await axiosProducto.get(
        API_CONFIG.PRODUCTO.ENDPOINTS.LISTAR_PRODUCTOS
      );
      // Agregar imagen genérica si no tiene linkImagen
      return response.data.map(producto => ({
        ...producto,
        linkImagen: producto.linkImagen || this.getImagenGenerica(),
        // Mapeo para compatibilidad con componentes que usan 'imagen'
        imagen: producto.linkImagen || this.getImagenGenerica(),
        id: producto.idProducto,
        categoria: this.mapCategoria(producto.idCategoria),
        unidadMedida: this.getUnidadMedida(producto.idCategoria)
      }));
    } catch (error) {
      console.error('Error listando productos:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Mapear ID de categoría a nombre
   * @param {number} idCategoria - ID de la categoría
   * @returns {string} Nombre de la categoría
   */
  mapCategoria(idCategoria) {
    const categorias = {
      1: 'Frutas',
      2: 'Verduras',
      3: 'Otros',
      4: 'Hierbas'
    };
    return categorias[idCategoria] || 'Sin categoría';
  },

  /**
   * Obtener producto por ID
   * @param {string} id - ID del producto
   * @returns {Promise} Datos del producto
   */
  async obtenerProducto(id) {
    try {
      const response = await axiosProducto.get(
        `${API_CONFIG.PRODUCTO.ENDPOINTS.OBTENER_PRODUCTO}/${id}`
      );
      const producto = response.data;
      return {
        ...producto,
        unidadMedida: this.getUnidadMedida(producto.idCategoria)
      };
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Crear nuevo producto (Admin/Vendedor)
   * @param {Object} productoData - Datos del producto
   * @returns {Promise} Producto creado
   */
  async crearProducto(productoData) {
    try {
      const response = await axiosProducto.post(
        API_CONFIG.PRODUCTO.ENDPOINTS.CREAR_PRODUCTO,
        productoData
      );
      return response.data;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar producto existente
   * @param {string} id - ID del producto
   * @param {Object} productoData - Datos a actualizar
   * @returns {Promise} Producto actualizado
   */
  async actualizarProducto(id, productoData) {
    try {
      const response = await axiosProducto.put(
        `${API_CONFIG.PRODUCTO.ENDPOINTS.ACTUALIZAR_PRODUCTO}/${id}`,
        productoData
      );
      return response.data;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Eliminar producto
   * @param {string} id - ID del producto
   * @returns {Promise} Confirmación de eliminación
   */
  async eliminarProducto(id) {
    try {
      const response = await axiosProducto.delete(
        `${API_CONFIG.PRODUCTO.ENDPOINTS.ELIMINAR_PRODUCTO}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Buscar productos por término
   * @param {string} termino - Término de búsqueda
   * @returns {Promise} Productos que coinciden
   */
  async buscarProductos(termino) {
    try {
      // Filtrar localmente en lugar de hacer llamada a la API
      const todosLosProductos = await this.listarProductos();
      if (!termino || termino.trim() === '') {
        return todosLosProductos;
      }
      const terminoBusqueda = termino.toLowerCase();
      return todosLosProductos.filter(producto => 
        producto.nombre?.toLowerCase().includes(terminoBusqueda) ||
        producto.descripcion?.toLowerCase().includes(terminoBusqueda) ||
        producto.categoria?.toLowerCase().includes(terminoBusqueda)
      );
    } catch (error) {
      console.error('Error buscando productos:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener productos por categoría
   * @param {string} categoria - Nombre o ID de categoría
   * @returns {Promise} Productos de la categoría
   */
  async obtenerPorCategoria(categoria) {
    try {
      // Filtrar localmente en lugar de hacer llamada a la API
      const todosLosProductos = await this.listarProductos();
      if (!categoria || categoria.trim() === '') {
        return todosLosProductos;
      }
      const categoriaLower = categoria.toLowerCase();
      return todosLosProductos.filter(producto => 
        producto.categoria?.toLowerCase() === categoriaLower ||
        producto.categoria?.toLowerCase().includes(categoriaLower)
      );
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar stock de producto
   * @param {string} id - ID del producto
   * @param {number} cantidad - Nueva cantidad de stock
   * @returns {Promise} Producto con stock actualizado
   */
  async actualizarStock(id, cantidad) {
    try {
      const response = await axiosProducto.patch(
        `${API_CONFIG.PRODUCTO.ENDPOINTS.ACTUALIZAR_PRODUCTO}/${id}/stock`,
        { stock: cantidad }
      );
      return response.data;
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener productos con stock bajo
   * @param {number} umbral - Umbral de stock bajo (default: 10)
   * @returns {Promise} Productos con stock bajo
   */
  async obtenerProductosStockBajo(umbral = 10) {
    try {
      const productos = await this.listarProductos();
      return productos.filter(p => p.stock <= umbral);
    } catch (error) {
      console.error('Error obteniendo productos con stock bajo:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener productos destacados/activos
   * @returns {Promise} Productos activos
   */
  async obtenerProductosActivos() {
    try {
      const productos = await this.listarProductos();
      return productos.filter(p => p.activo === true || p.estaActivo === 'S');
    } catch (error) {
      console.error('Error obteniendo productos activos:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Manejar errores de API
   * @param {Error} error - Error de Axios
   * @returns {Error} Error formateado
   */
  handleError(error) {
    if (error.response) {
      // El servidor respondió con error
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     'Error en el servidor';
      return new Error(message);
    } else if (error.request) {
      // No hubo respuesta del servidor
      return new Error('No se pudo conectar con el servidor de productos');
    } else {
      // Error en la configuración de la petición
      return new Error(error.message || 'Error desconocido');
    }
  }
};

export default ProductoService;

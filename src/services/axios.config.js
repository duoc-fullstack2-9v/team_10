// =============================================
// CLIENTE AXIOS - Configuración Base
// =============================================
import axios from 'axios';
import { API_TIMEOUT, COMMON_HEADERS } from '../config/api.config';

// Crear instancia de Axios para Microservicio de Usuarios
export const axiosUsuario = axios.create({
  baseURL: 'http://34.193.190.24:8081',
  timeout: API_TIMEOUT,
  headers: COMMON_HEADERS
});

// Crear instancia de Axios para Microservicio de Productos
export const axiosProducto = axios.create({
  baseURL: 'http://34.202.46.121:8081',
  timeout: API_TIMEOUT,
  headers: COMMON_HEADERS
});

// =============================================
// INTERCEPTORES PARA USUARIOS
// =============================================

// Interceptor de Request - Agregar token de autenticación
axiosUsuario.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 Request a Usuario: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Error en request Usuario:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejar respuestas y errores
axiosUsuario.interceptors.response.use(
  (response) => {
    console.log(`✅ Response de Usuario: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error(`❌ Error ${error.response.status} de Usuario:`, error.response.data);
      
      // Si es 401 (No autorizado), limpiar token y redirigir a login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ No hay respuesta del servidor Usuario:', error.request);
    } else {
      // Algo pasó al configurar la petición
      console.error('❌ Error configurando petición Usuario:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// =============================================
// INTERCEPTORES PARA PRODUCTOS
// =============================================

// Interceptor de Request
axiosProducto.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 Request a Producto: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Error en request Producto:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response
axiosProducto.interceptors.response.use(
  (response) => {
    console.log(`✅ Response de Producto: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ Error ${error.response.status} de Producto:`, error.response.data);
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('❌ No hay respuesta del servidor Producto:', error.request);
    } else {
      console.error('❌ Error configurando petición Producto:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Exportar instancias configuradas
export default {
  usuario: axiosUsuario,
  producto: axiosProducto
};

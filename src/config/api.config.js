// =============================================
// CONFIGURACIÓN DE APIs - Microservicios AWS
// =============================================

// Detectar si estamos en desarrollo (usando Vite proxy) o producción
const isDevelopment = import.meta.env.DEV;

// URLs base de los microservicios
export const API_CONFIG = {
  // Microservicio de Usuarios
  USUARIO: {
    BASE_URL: isDevelopment ? '' : 'http://34.193.190.24:8081',
    ENDPOINTS: {
      LOGIN: '/api/usuarios/login',
      REGISTRO: '/api/usuarios',
      OBTENER_USUARIO: '/api/usuarios',
      ACTUALIZAR_USUARIO: '/api/usuarios',
      ELIMINAR_USUARIO: '/api/usuarios',
      LISTAR_USUARIOS: '/api/usuarios',
      VALIDAR_TOKEN: '/api/usuarios/validate'
    }
  },
  
  // Microservicio de Productos
  PRODUCTO: {
    BASE_URL: isDevelopment ? '' : 'http://34.202.46.121:8081',
    ENDPOINTS: {
      LISTAR_PRODUCTOS: '/api/productos',
      OBTENER_PRODUCTO: '/api/productos',
      CREAR_PRODUCTO: '/api/productos',
      ACTUALIZAR_PRODUCTO: '/api/productos',
      ELIMINAR_PRODUCTO: '/api/productos',
      BUSCAR_PRODUCTOS: '/api/productos/search',
      PRODUCTOS_POR_CATEGORIA: '/api/productos/categoria'
    }
  },
  
  // MongoDB Atlas Connection String (para referencia)
  MONGODB: {
    CONNECTION_STRING: 'mongodb+srv://ctapiad_db_user:MhRBXg6OTYK9AqQv@huerto.bi4rvwk.mongodb.net/',
    DATABASE: 'Huerto',
    COLLECTION: 'Huerto'
  }
};

// Timeout para las peticiones (30 segundos)
export const API_TIMEOUT = 30000;

// Headers comunes para todas las peticiones
export const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

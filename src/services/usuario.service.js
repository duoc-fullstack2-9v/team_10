// =============================================
// SERVICIO DE USUARIOS - API Calls
// =============================================
import { axiosUsuario } from './axios.config';
import { API_CONFIG } from '../config/api.config';

const UsuarioService = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Datos del usuario y token
   */
  async login(credentials) {
    try {
      console.log('🔐 Intentando login con:', { email: credentials.email });
      
      // Llamar directamente a la API sin interceptores para evitar problemas de autenticación
      const url = `${API_CONFIG.USUARIO.BASE_URL}${API_CONFIG.USUARIO.ENDPOINTS.LISTAR_USUARIOS}`;
      console.log('📡 Llamando a:', url);
      
      let response;
      try {
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          mode: 'cors' // Asegurar que CORS esté habilitado
        });
        
        console.log('📥 Respuesta del servidor:', response.status, response.statusText);
      } catch (fetchError) {
        console.error('🚨 Error de red al hacer fetch:', fetchError);
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión o que el servidor esté activo.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      let usuarios;
      try {
        usuarios = await response.json();
        console.log(`👥 Total de usuarios recibidos: ${usuarios.length}`);
      } catch (jsonError) {
        console.error('🚨 Error al parsear JSON:', jsonError);
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Buscar usuario con email y password coincidentes
      const usuario = usuarios.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() && 
        u.password === credentials.password
      );

      if (!usuario) {
        console.log('❌ Usuario no encontrado o contraseña incorrecta');
        // Verificar si el email existe
        const emailExists = usuarios.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
        if (emailExists) {
          console.log('📧 Email existe pero password no coincide');
          console.log('Password recibida:', credentials.password);
          console.log('Password en BD:', emailExists.password);
        } else {
          console.log('📧 Email no existe en la base de datos');
        }
        throw new Error('Email o contraseña incorrectos');
      }

      console.log('✅ Usuario autenticado:', { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email,
        rol: usuario.idTipoUsuario 
      });

      // Generar un token simple (en producción esto vendría del backend)
      const token = btoa(`${usuario.email}:${Date.now()}`);
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      console.log('💾 Token y usuario guardados en localStorage');
      
      return {
        usuario: usuario,
        token: token
      };
    } catch (error) {
      console.error('💥 Error en login:', error);
      // Re-lanzar el error original si es uno de los mensajes conocidos
      if (error.message.includes('Email o contraseña incorrectos') || 
          error.message.includes('No se pudo conectar') ||
          error.message.includes('servidor')) {
        throw error;
      }
      throw new Error('Error inesperado al iniciar sesión');
    }
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} Usuario creado
   */
  async registrar(userData) {
    try {
      const response = await axiosUsuario.post(
        API_CONFIG.USUARIO.ENDPOINTS.REGISTRO,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Obtener usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise} Datos del usuario
   */
  async obtenerUsuario(id) {
    try {
      const response = await axiosUsuario.get(
        `${API_CONFIG.USUARIO.ENDPOINTS.OBTENER_USUARIO}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Listar todos los usuarios (Admin)
   * @returns {Promise} Lista de usuarios
   */
  async listarUsuarios() {
    try {
      const response = await axiosUsuario.get(
        API_CONFIG.USUARIO.ENDPOINTS.LISTAR_USUARIOS
      );
      return response.data;
    } catch (error) {
      console.error('Error listando usuarios:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Actualizar usuario
   * @param {string} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise} Usuario actualizado
   */
  async actualizarUsuario(id, userData) {
    try {
      const response = await axiosUsuario.put(
        API_CONFIG.USUARIO.ENDPOINTS.ACTUALIZAR_USUARIO,
        { ...userData, id }
      );
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Eliminar usuario
   * @param {string} id - ID del usuario
   * @returns {Promise} Confirmación de eliminación
   */
  async eliminarUsuario(id) {
    try {
      const response = await axiosUsuario.delete(
        `${API_CONFIG.USUARIO.ENDPOINTS.ELIMINAR_USUARIO}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Validar token de autenticación
   * @returns {Promise} Token válido o no
   */
  async validarToken() {
    try {
      const response = await axiosUsuario.get(
        API_CONFIG.USUARIO.ENDPOINTS.VALIDAR_TOKEN
      );
      return response.data;
    } catch (error) {
      console.error('Error validando token:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Obtener usuario actual del localStorage
   * @returns {Object|null} Usuario actual
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si hay usuario autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
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
      return new Error('No se pudo conectar con el servidor de usuarios');
    } else {
      // Error en la configuración de la petición
      return new Error(error.message || 'Error desconocido');
    }
  }
};

export default UsuarioService;

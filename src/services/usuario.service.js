// =============================================
// SERVICIO DE USUARIOS - API Calls
// =============================================
import { axiosUsuario } from './axios.config';
import { API_CONFIG } from '../config/api.config';

const UsuarioService = {
  /**
   * Iniciar sesión usando el endpoint de login del microservicio con BCrypt
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Datos del usuario autenticado
   */
  async login(credentials) {
    try {
      console.log('🔐 Intentando login con:', { email: credentials.email });
      
      // Usar el endpoint de login del microservicio
      const url = `${API_CONFIG.USUARIO.BASE_URL}${API_CONFIG.USUARIO.ENDPOINTS.LOGIN}`;
      console.log('📡 Llamando al endpoint de login:', url);
      
      let response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });
        
        console.log('📥 Respuesta del servidor:', response.status, response.statusText);
      } catch (fetchError) {
        console.error('🚨 Error de red al hacer fetch:', fetchError);
        throw new Error('No se pudo conectar con el microservicio de usuarios. Verifica tu conexión.');
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log('📦 Datos recibidos:', { success: responseData.success, message: responseData.message });
      } catch (jsonError) {
        console.error('🚨 Error al parsear JSON:', jsonError);
        throw new Error('Respuesta inválida del microservicio');
      }

      // Verificar si el login fue exitoso
      if (!response.ok || !responseData.success) {
        const errorMessage = responseData.message || 'Email o contraseña incorrectos';
        console.log('❌ Login fallido:', errorMessage);
        throw new Error(errorMessage);
      }

      // El microservicio devuelve los datos del usuario directamente en responseData
      const usuario = {
        idUsuario: responseData.id,
        nombre: responseData.nombre,
        email: responseData.email,
        fechaRegistro: responseData.fechaRegistro,
        direccion: responseData.direccion,
        telefono: responseData.telefono,
        idComuna: responseData.idComuna,
        idTipoUsuario: responseData.idTipoUsuario
      };
      
      console.log('✅ Usuario autenticado:', { 
        id: usuario.idUsuario, 
        nombre: usuario.nombre, 
        email: usuario.email,
        rol: usuario.idTipoUsuario 
      });

      // Guardar usuario en localStorage para mantener sesión
      localStorage.setItem('user', JSON.stringify(usuario));
      
      console.log('💾 Usuario guardado en localStorage');
      
      return {
        usuario: usuario
      };
    } catch (error) {
      console.error('💥 Error en login:', error);
      throw error;
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
   * Cerrar sesión
   */
  logout() {
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
    return !!localStorage.getItem('user');
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

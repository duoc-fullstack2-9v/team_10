/**
 * Servicio para manejar la subida de imágenes a AWS S3
 * Usa el endpoint del microservicio de productos para generar URL prefirmada
 */

import axios from './axios.config';

const S3_CONFIG = {
  BUCKET_NAME: 'huerto-hogar-images',
  REGION: 'us-east-1'
};

class ImagenService {
  
  /**
   * Subir imagen a S3 usando URL prefirmada del backend
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} URL pública de la imagen en S3
   */
  async subirImagenS3(file) {
    if (!file) {
      throw new Error('No se proporcionó ningún archivo');
    }

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validar tamaño (máximo 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error('La imagen no debe superar los 5MB');
    }

    try {
      // 1. Generar nombre único para el archivo
      const fileName = `producto-${Date.now()}-${file.name}`;

      // 2. Obtener URL prefirmada del backend
      const urlResponse = await axios.get('/api/productos/generar-url-subida', {
        params: { fileName }
      });

      const { presignedUrl, publicUrl } = urlResponse.data;

      // 3. Subir archivo directamente a S3 usando la URL prefirmada
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        }
      });

      // 4. Retornar la URL pública de la imagen
      return publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen a S3:', error);
      throw new Error('Error al subir la imagen. Por favor intenta nuevamente.');
    }
  }

  /**
   * Convertir imagen a Base64 para preview
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} Imagen en base64
   */
  convertirABase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Obtener URL de imagen genérica cuando no hay imagen
   * @returns {string} SVG data URL de imagen genérica
   */
  getImagenGenerica() {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="45%25" font-size="80" text-anchor="middle" dy=".3em"%3E🌱%3C/text%3E%3Ctext x="50%25" y="75%25" font-size="14" text-anchor="middle" fill="%23999"%3ESin imagen%3C/text%3E%3C/svg%3E';
  }

  /**
   * Validar formato de imagen
   * @param {File} file - Archivo a validar
   * @returns {boolean} true si es válido
   */
  validarImagen(file) {
    const formatosValidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return formatosValidos.includes(file.type);
  }

  /**
   * Obtener extensión del archivo
   * @param {File} file - Archivo
   * @returns {string} Extensión del archivo
   */
  getExtension(file) {
    return file.name.split('.').pop().toLowerCase();
  }
}

export default new ImagenService();

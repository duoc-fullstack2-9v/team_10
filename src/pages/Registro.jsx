import { useState } from 'react';
import '../assets/form.css';

function Registro() {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmar: '',
    telefono: '',
    region: '',
    comuna: ''
  });

  const [errors, setErrors] = useState({});

  // Datos de regiones y comunas (simplificado para el ejemplo)
  const regionesYComunas = {
    'arica': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
    'tarapaca': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
    'antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
    'atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'],
    'coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
    'valparaiso': ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana'],
    'ohiggins': ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'],
    'maule': ['Talca', 'ConstiTución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
    'nuble': ['Chillán', 'Bulnes', 'Cobquecura', 'Coelemu', 'Coihueco', 'Chillán Viejo', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'],
    'biobio': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'],
    'araucania': ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'],
    'losrios': ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'],
    'loslagos': ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'FruTillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'],
    'aysen': ['Coihaique', 'Lago Verde', 'Aisén', 'Cisnes', 'Guaitecas', 'Cochrane', "O'Higgins", 'Tortel', 'Chile Chico', 'Río Ibáñez'],
    'magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'AntárTica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'],
    'metropolitana': ['Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'Santiago', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor']
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Si cambia la región, resetear comuna
    if (name === 'region') {
      setFormData(prev => ({
        ...prev,
        comuna: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmar) {
      newErrors.confirmar = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmar) {
      newErrors.confirmar = 'Las contraseñas no coinciden';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.region) {
      newErrors.region = 'Debe seleccionar una región';
    }

    if (!formData.comuna) {
      newErrors.comuna = 'Debe seleccionar una comuna';
    }

    return newErrors;
  };

  // Estados adicionales para el registro
  const [isLoading, setIsLoading] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // Función para enviar usuario a la API
  const crearUsuario = async (userData) => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.text();
      
      if (response.ok) {
        return { success: true, message: result };
      } else {
        return { success: false, message: result || 'Error al crear usuario' };
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return { 
        success: false, 
        message: 'No se pudo conectar con el servidor. Verifica que la API esté funcionando.' 
      };
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Preparar datos para la API (formato del modelo Usuario)
    const userData = {
      nombre: formData.nombre,
      email: formData.correo,
      password: formData.password,
      fechaRegistro: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      direccion: `${formData.comuna}, ${formData.region}`, // Combinamos comuna y región
      telefono: parseInt(formData.telefono),
      idComuna: 1, // Por defecto, en una app real buscarías el ID real
      idTipoUsuario: 3 // 3 = Cliente (según los datos que vimos)
    };

    try {
      const result = await crearUsuario(userData);
      
      if (result.success) {
        setRegistroExitoso(true);
        alert('¡Registro exitoso! Usuario creado correctamente en la base de datos.');
        
        // Resetear formulario
        setFormData({
          nombre: '',
          correo: '',
          password: '',
          confirmar: '',
          telefono: '',
          region: '',
          comuna: ''
        });
      } else {
        // Manejar errores específicos del servidor
        if (result.message.includes('email')) {
          setErrors({ correo: 'Este email ya está registrado' });
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado. Inténtalo nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>
        
        {/* Mensaje de error general */}
        {errors.general && (
          <div className="error-message" style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            color: '#c66', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px',
            display: 'block',
            width: '100%'
          }}>
            {errors.general}
          </div>
        )}
        
        {/* Mensaje de éxito */}
        {registroExitoso && (
          <div className="success-message" style={{ 
            background: '#efe', 
            border: '1px solid #cfc', 
            color: '#6c6', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px',
            display: 'block',
            width: '100%'
          }}>
            ¡Usuario registrado correctamente en la base de datos!
          </div>
        )}
        
        <label htmlFor="nombre">Nombre Completo:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          maxLength="100"
        />
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}

        <label htmlFor="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
        />
        {errors.correo && <span className="error-message">{errors.correo}</span>}

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}

        <label htmlFor="confirmar">Confirmar Contraseña:</label>
        <input
          type="password"
          id="confirmar"
          name="confirmar"
          value={formData.confirmar}
          onChange={handleChange}
        />
        {errors.confirmar && <span className="error-message">{errors.confirmar}</span>}

        <label htmlFor="telefono">Teléfono:</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          maxLength="15"
        />
        {errors.telefono && <span className="error-message">{errors.telefono}</span>}

        <label htmlFor="region">Región:</label>
        <select
          id="region"
          name="region"
          value={formData.region}
          onChange={handleChange}
        >
          <option value="">Seleccione una región</option>
          <option value="arica">Arica y Parinacota</option>
          <option value="tarapaca">Tarapacá</option>
          <option value="antofagasta">Antofagasta</option>
          <option value="atacama">Atacama</option>
          <option value="coquimbo">Coquimbo</option>
          <option value="valparaiso">Valparaíso</option>
          <option value="ohiggins">O'Higgins</option>
          <option value="maule">Maule</option>
          <option value="nuble">Ñuble</option>
          <option value="biobio">Biobío</option>
          <option value="araucania">La Araucanía</option>
          <option value="losrios">Los Ríos</option>
          <option value="loslagos">Los Lagos</option>
          <option value="aysen">Aysén</option>
          <option value="magallanes">Magallanes</option>
          <option value="metropolitana">Metropolitana</option>
        </select>
        {errors.region && <span className="error-message">{errors.region}</span>}

        <label htmlFor="comuna">Comuna:</label>
        <select
          id="comuna"
          name="comuna"
          value={formData.comuna}
          onChange={handleChange}
        >
          <option value="">Seleccione una comuna</option>
          {formData.region && regionesYComunas[formData.region]?.map((comuna) => (
            <option key={comuna} value={comuna.toLowerCase()}>
              {comuna}
            </option>
          ))}
        </select>
        {errors.comuna && <span className="error-message">{errors.comuna}</span>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </main>
  );
}

export default Registro;
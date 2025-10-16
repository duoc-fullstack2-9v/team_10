import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/form.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    return newErrors;
  };

  // Función para autenticar usuario
  const authenticateUser = async (email, password) => {
    try {
      // Obtener todos los usuarios de la API a través del proxy
      const response = await fetch('http://localhost:8081/api/usuarios');
      
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const users = await response.json();
      
      // Buscar usuario con email y password coincidentes
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      return user || null;
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw new Error('No se pudo conectar con el servidor. Verifica que la API esté funcionando.');
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
    setLoginError('');

    try {
      const user = await authenticateUser(formData.email, formData.password);
      
      if (user) {
        // Login exitoso - usar contexto de autenticación
        const userData = {
          idUsuario: user.idUsuario,
          nombre: user.nombre,
          email: user.email,
          idTipoUsuario: user.idTipoUsuario,
          direccion: user.direccion,
          telefono: user.telefono
        };
        
        console.log('Login - User found:', user);
        console.log('Login - UserData to save:', userData);
        
        login(userData);
        
        // Redirigir según el tipo de usuario
        if (user.idTipoUsuario === 1) {
          // Administrador -> Panel de admin
          alert(`¡Bienvenido Administrador ${user.nombre}!`);
          navigate('/admin');
        } else if (user.idTipoUsuario === 2) {
          // Vendedor -> Panel de vendedor (por ahora home)
          alert(`¡Bienvenido Vendedor ${user.nombre}!`);
          navigate('/');
        } else {
          // Cliente -> Home
          alert(`¡Bienvenido ${user.nombre}!`);
          navigate('/');
        }
      } else {
        // Credenciales incorrectas
        setLoginError('Email o contraseña incorrectos. ¿No tienes cuenta?');
      }
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        {loginError && (
          <div className="login-error">
            {loginError}
            {loginError.includes('No tienes cuenta') && (
              <Link to="/registro" className="register-link">
                Regístrate aquí
              </Link>
            )}
          </div>
        )}
        
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu-email@ejemplo.com"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Tu contraseña"
        />
        {errors.password && <span className="error-message">{errors.password}</span>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        
        <div className="form-links">
          <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </div>
      </form>

      {/* Información de usuarios de prueba */}
      <div className="demo-credentials">
        <h3>👤 Usuarios de prueba:</h3>
        <div className="credential-item">
          <strong>Admin:</strong> admin@profesor.duoc.cl / Admin*123
        </div>
        <div className="credential-item">
          <strong>Vendedor:</strong> vendedor@duoc.cl / Vend#2025
        </div>
        <div className="credential-item">
          <strong>Cliente:</strong> ana.gomez@gmail.com / Ana$2025
        </div>
      </div>
    </main>
  );
}

export default Login;
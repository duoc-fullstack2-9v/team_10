import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';
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
  const [toast, setToast] = useState({ message: '', type: '' });

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
      // Usar el login del contexto que ahora usa UsuarioService
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const user = result.user;
        setToast({ message: `¡Bienvenido ${user.nombre}!`, type: 'success' });
        
        // Redirigir según el tipo de usuario después del toast
        setTimeout(() => {
          if (user.idTipoUsuario === 1) {
            navigate('/admin');
          } else if (user.idTipoUsuario === 2) {
            navigate('/');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        setLoginError(result.message || 'Email o contraseña incorrectos');
        setToast({ message: 'Email o contraseña incorrectos', type: 'error' });
      }
    } catch (error) {
      const errorMsg = 'Error al iniciar sesión. Por favor, intenta nuevamente.';
      setLoginError(errorMsg);
      setToast({ message: errorMsg, type: 'error' });
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })}
      />
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
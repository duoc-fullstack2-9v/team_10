import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../assets/main.css';
import huertoLogo from '../assets/img/huerto_logo.png';
import carroImg from '../assets/img/carro.png';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para verificar si el enlace está activo
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-text">
            <img src={huertoLogo} alt="Logo" />
            <span>Huerto Hogar</span>
          </div>
          
          {/* Botón hamburguesa */}
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Menú de navegación */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={isActiveLink('/') ? 'nav-link-active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/productos" 
                className={isActiveLink('/productos') ? 'nav-link-active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
            </li>
            <li>
              <Link 
                to="/nosotros" 
                className={isActiveLink('/nosotros') ? 'nav-link-active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link 
                to="/blogs" 
                className={isActiveLink('/blogs') ? 'nav-link-active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link 
                to="/contacto" 
                className={isActiveLink('/contacto') ? 'nav-link-active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </li>
          </ul>
          
          <div className="navbar-actions">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
            <Link to="/registro" onClick={() => setIsMenuOpen(false)}>Registrar Usuario</Link>
            <Link to="/carrito" className="cart-link" onClick={() => setIsMenuOpen(false)}>
              <img src={carroImg} width="40" alt="Carrito" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Nav;
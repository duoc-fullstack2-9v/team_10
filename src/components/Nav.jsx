 
 import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NavLink from './NavLink';
import '../assets/main.css';
import huertoLogo from '../assets/img/huerto_logo.png';
import carroImg from '../assets/img/carro.png';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout, getRoleName } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
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
            <NavLink to="/" onClick={handleLinkClick}>
              Home
            </NavLink>
            
            <NavLink to="/productos" onClick={handleLinkClick}>
              Productos
            </NavLink>
            
            <NavLink to="/nosotros" onClick={handleLinkClick}>
              Nosotros
            </NavLink>
            
            <NavLink to="/blogs" onClick={handleLinkClick}>
              Blogs
            </NavLink>
            
            <NavLink to="/contacto" onClick={handleLinkClick}>
              Contacto
            </NavLink>
          </ul>
          
          <div className="navbar-actions">
            {isAuthenticated() ? (
              // Usuario autenticado
              <>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginRight: '15px',
                  color: '#2c3e50',
                  fontSize: '0.9em'
                }}>
                  <span>👤 {user.nombre}</span>
                  <span style={{ 
                    padding: '2px 6px', 
                    backgroundColor: user.idTipoUsuario === 1 ? '#e74c3c' : 
                                     user.idTipoUsuario === 2 ? '#f39c12' : '#27ae60',
                    color: 'white', 
                    borderRadius: '3px',
                    fontSize: '0.7em'
                  }}>
                    {getRoleName()}
                  </span>
                </div>
                
                {/* Botón de panel de admin solo para administradores */}
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    style={{ 
                      padding: '5px 10px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8em',
                      marginRight: '10px'
                    }}
                  >
                    🛠️ Admin
                  </Link>
                )}
                
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  style={{ 
                    padding: '5px 15px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  Cerrar Sesión
                </button>
                
                <Link to="/carrito" className="cart-link" onClick={() => setIsMenuOpen(false)}>
                  <img src={carroImg} width="40" alt="Carrito" />
                  <span>Cart</span>
                </Link>
              </>
            ) : (
              // Usuario no autenticado
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
                <Link to="/registro" onClick={() => setIsMenuOpen(false)}>Registrar Usuario</Link>
                <Link to="/carrito" className="cart-link" onClick={() => setIsMenuOpen(false)}>
                  <img src={carroImg} width="40" alt="Carrito" />
                  <span>Cart</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Nav;
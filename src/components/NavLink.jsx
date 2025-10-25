import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, children, onClick }) {
  const location = useLocation();

  // Función para verificar si este enlace específico está activo
  const isActive = location.pathname === to;

  return (
    <li>
      <Link 
        to={to}
        className={isActive ? 'nav-link-active' : ''}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
}

export default NavLink;
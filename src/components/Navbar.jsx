import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('reforest_token');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="brand-wrap">
        <NavLink to="/dashboard" className="brand">ReForest</NavLink>
      </div>

      <div className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/incendios">Incendios</NavLink>
        <NavLink to="/donaciones">Donaciones</NavLink>
        <NavLink to="/voluntarios">Voluntarios</NavLink>
      </div>

      <button type="button" onClick={handleLogout} className="logout-button">
        Cerrar sesión
      </button>
    </nav>
  );
}

export default Navbar;

import { Link } from 'react-router-dom';

function Dashboard() {
  const token = sessionStorage.getItem('reforest_token');

  return (
    <main className="page-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Sistema de gestión ambiental</p>
          <h1>Gestión ReForest</h1>
        </div>
        {token && <span className="user-badge">Usuario autenticado</span>}
      </section>

      <div className="dashboard-grid">
        <Link to="/incendios" className="module-card">
          <span className="module-number">01</span>
          <h2>Incendios</h2>
          <p>Registra y consulta reportes de incendios.</p>
        </Link>

        <Link to="/donaciones" className="module-card">
          <span className="module-number">02</span>
          <h2>Donaciones</h2>
          <p>Administra aportes y especies donadas.</p>
        </Link>

        <Link to="/voluntarios" className="module-card">
          <span className="module-number">03</span>
          <h2>Voluntarios</h2>
          <p>Consulta y gestiona colaboradores.</p>
        </Link>
      </div>

      <p className="notice-text">Notificaciones: módulo pendiente de implementación en la API.</p>
    </main>
  );
}

export default Dashboard;

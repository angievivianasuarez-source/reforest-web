import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage';
import { loginUser } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identificador: '', contrasena: '' });
  const [status, setStatus] = useState({ message: '', type: 'error' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.identificador || !formData.contrasena) {
      setStatus({ message: 'Correo y contraseña son obligatorios.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ message: '', type: 'error' });
      await loginUser(formData.identificador, formData.contrasena);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setStatus({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Conservación ambiental</p>
        <h1>ReForest</h1>
        <p className="muted">Accede al panel de gestión del sistema.</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label htmlFor="identificador">Correo</label>
          <input
            id="identificador"
            name="identificador"
            type="email"
            value={formData.identificador}
            onChange={handleChange}
            autoComplete="username"
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <StatusMessage message={status.message} type={status.type} />
        </form>
      </div>
    </main>
  );
}

export default Login;

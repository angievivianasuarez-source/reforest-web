import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';
import { createVoluntario, deleteVoluntario, getVoluntarios, updateVoluntario } from '../services/voluntariosService';

const emptyForm = {
  id: '',
  nombre: '',
  correo: '',
  telefono: '',
  disponibilidad: ''
};

function Voluntarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [editingId, setEditingId] = useState(null);

  const loadVoluntarios = async () => {
    try {
      setLoading(true);
      const data = await getVoluntarios();
      setItems(data || []);
      setMessage({ text: '', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoluntarios();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.nombre || !form.correo || !form.telefono || !form.disponibilidad) {
      setMessage({ text: 'Nombre, correo, teléfono y disponibilidad son obligatorios.', type: 'error' });
      return;
    }

    const payload = {
      id: Number(form.id) || 0,
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono.trim(),
      disponibilidad: form.disponibilidad.trim()
    };

    try {
      if (editingId) {
        await updateVoluntario(payload);
        setMessage({ text: 'Voluntario actualizado.', type: 'success' });
      } else {
        await createVoluntario(payload);
        setMessage({ text: 'Voluntario registrado.', type: 'success' });
      }
      resetForm();
      await loadVoluntarios();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      nombre: item.nombre || '',
      correo: item.correo || '',
      telefono: item.telefono || '',
      disponibilidad: item.disponibilidad || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este voluntario?')) return;

    try {
      await deleteVoluntario(id);
      setMessage({ text: 'Voluntario eliminado.', type: 'success' });
      await loadVoluntarios();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <main className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h1>Voluntarios</h1>
        </div>
        <button type="button" className="secondary-button" onClick={loadVoluntarios}>Actualizar</button>
      </section>

      <StatusMessage message={message.text} type={message.type} />

      <form className="crud-form" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={form.id} />
        <h2>{editingId ? 'Editar voluntario' : 'Registrar voluntario'}</h2>

        <div className="form-grid">
          <label>
            Nombre
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label>
            Correo
            <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
          </label>
          <label>
            Teléfono
            <input name="telefono" value={form.telefono} onChange={handleChange} required />
          </label>
          <label>
            Disponibilidad
            <input name="disponibilidad" value={form.disponibilidad} onChange={handleChange} required />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">{editingId ? 'Guardar cambios' : 'Registrar'}</button>
          {editingId && (
            <button type="button" className="secondary-button" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loading label="Cargando voluntarios..." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Disponibilidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6">No hay registros.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.correo}</td>
                    <td>{item.telefono}</td>
                    <td>{item.disponibilidad}</td>
                    <td>
                      <button type="button" className="table-action" onClick={() => handleEdit(item)}>
                        Editar
                      </button>
                      <button type="button" className="table-action secondary" onClick={() => handleDelete(item.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Voluntarios;

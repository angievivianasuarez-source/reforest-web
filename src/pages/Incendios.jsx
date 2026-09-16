import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';
import { createIncendio, deleteIncendio, getIncendios, updateIncendio } from '../services/incendiosService';

const emptyForm = {
  id: '',
  ubicacion: '',
  descripcion: '',
  estado: '',
  latitud: '',
  longitud: ''
};

function Incendios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [editingId, setEditingId] = useState(null);

  const loadIncendios = async () => {
    try {
      setLoading(true);
      const data = await getIncendios();
      setItems(data || []);
      setMessage({ text: '', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncendios();
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

    if (!form.ubicacion || !form.descripcion || !form.estado || !form.latitud || !form.longitud) {
      setMessage({ text: 'Completa ubicacion, descripcion, estado, latitud y longitud.', type: 'error' });
      return;
    }

    const payload = {
      id: Number(form.id) || 0,
      ubicacion: form.ubicacion.trim(),
      descripcion: form.descripcion.trim(),
      estado: form.estado.trim(),
      latitud: Number(form.latitud),
      longitud: Number(form.longitud)
    };

    try {
      if (editingId) {
        await updateIncendio(payload);
        setMessage({ text: 'Incendio actualizado.', type: 'success' });
      } else {
        await createIncendio(payload);
        setMessage({ text: 'Incendio registrado.', type: 'success' });
      }
      resetForm();
      await loadIncendios();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      ubicacion: item.ubicacion || '',
      descripcion: item.descripcion || '',
      estado: item.estado || '',
      latitud: item.latitud ?? '',
      longitud: item.longitud ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este incendio?')) return;

    try {
      await deleteIncendio(id);
      setMessage({ text: 'Incendio eliminado.', type: 'success' });
      await loadIncendios();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <main className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h1>Incendios</h1>
        </div>
        <button type="button" className="secondary-button" onClick={loadIncendios}>Actualizar</button>
      </section>

      <StatusMessage message={message.text} type={message.type} />

      <form className="crud-form" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={form.id} />
        <h2>{editingId ? 'Editar incendio' : 'Registrar incendio'}</h2>

        <div className="form-grid">
          <label>
            Ubicación
            <input name="ubicacion" value={form.ubicacion} onChange={handleChange} required />
          </label>
          <label>
            Estado
            <input name="estado" value={form.estado} onChange={handleChange} required />
          </label>
          <label>
            Latitud
            <input type="number" step="any" name="latitud" value={form.latitud} onChange={handleChange} required />
          </label>
          <label>
            Longitud
            <input type="number" step="any" name="longitud" value={form.longitud} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
        </label>

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
        <Loading label="Cargando incendios..." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ubicación</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="8">No hay registros.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.ubicacion}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.estado}</td>
                    <td>{item.latitud ?? ''}</td>
                    <td>{item.longitud ?? ''}</td>
                    <td>{item.fechaRegistro ?? ''}</td>
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

export default Incendios;

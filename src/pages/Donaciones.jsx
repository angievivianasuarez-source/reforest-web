import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';
import { createDonacion, deleteDonacion, getDonaciones, updateDonacion } from '../services/donacionesService';

const emptyForm = {
  id: '',
  entidad: '',
  especie: '',
  cantidad: ''
};

function Donaciones() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [editingId, setEditingId] = useState(null);

  const loadDonaciones = async () => {
    try {
      setLoading(true);
      const data = await getDonaciones();
      setItems(data || []);
      setMessage({ text: '', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonaciones();
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

    if (!form.entidad || !form.especie || !form.cantidad) {
      setMessage({ text: 'Entidad, especie y cantidad son obligatorios.', type: 'error' });
      return;
    }

    const cantidad = Number(form.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setMessage({ text: 'La cantidad debe ser un número mayor a cero.', type: 'error' });
      return;
    }

    const payload = {
      id: Number(form.id) || 0,
      entidad: form.entidad.trim(),
      especie: form.especie.trim(),
      cantidad
    };

    try {
      if (editingId) {
        await updateDonacion(payload);
        setMessage({ text: 'Donación actualizada.', type: 'success' });
      } else {
        await createDonacion(payload);
        setMessage({ text: 'Donación registrada.', type: 'success' });
      }
      resetForm();
      await loadDonaciones();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      entidad: item.entidad || '',
      especie: item.especie || '',
      cantidad: item.cantidad ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta donación?')) return;

    try {
      await deleteDonacion(id);
      setMessage({ text: 'Donación eliminada.', type: 'success' });
      await loadDonaciones();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <main className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h1>Donaciones</h1>
        </div>
        <button type="button" className="secondary-button" onClick={loadDonaciones}>Actualizar</button>
      </section>

      <StatusMessage message={message.text} type={message.type} />

      <form className="crud-form" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={form.id} />
        <h2>{editingId ? 'Editar donación' : 'Registrar donación'}</h2>

        <div className="form-grid">
          <label>
            Entidad
            <input name="entidad" value={form.entidad} onChange={handleChange} required />
          </label>
          <label>
            Especie
            <input name="especie" value={form.especie} onChange={handleChange} required />
          </label>
          <label>
            Cantidad
            <input type="number" min="1" name="cantidad" value={form.cantidad} onChange={handleChange} required />
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
        <Loading label="Cargando donaciones..." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Entidad</th>
                <th>Especie</th>
                <th>Cantidad</th>
                <th>Fecha</th>
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
                    <td>{item.entidad}</td>
                    <td>{item.especie}</td>
                    <td>{item.cantidad}</td>
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

export default Donaciones;

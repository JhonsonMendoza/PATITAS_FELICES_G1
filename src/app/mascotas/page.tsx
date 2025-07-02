'use client';
import { useState, useEffect } from 'react';
import { createPet, deletePet, getPets, Pet, updatePet } from '@/apis/mascotas/route';
import { useAuth } from '@/context/authContext';

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState<Pet[]>([]);
  const [formData, setFormData] = useState({ nombre: '', tipo: '', edad: '', genero: '' });
  const [editData, setEditData] = useState<Pet | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { token } = useAuth();

  const fetchMascotas = async () => {
    if (!token) return;
    try {
      const res = await getPets(token);
      setMascotas(res);
      // Si no hay mascotas, mostrar formulario por defecto
      if (res.length === 0) setShowForm(true);
      else setShowForm(false);
    } catch (err) {
      console.error('Error al obtener mascotas:', err);
    }
  };

  useEffect(() => {
    fetchMascotas();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registrarMascota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createPet({ ...formData, edad: parseInt(formData.edad) }, token);
      setFormData({ nombre: '', tipo: '', edad: '', genero: '' });
      setShowForm(false);
      fetchMascotas();
    } catch (err) {
      console.error('Error al registrar mascota:', err);
    }
  };

  const eliminarMascota = async (id: string) => {
    if (!token) return;
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;
    try {
      await deletePet(id, token);
      fetchMascotas();
    } catch (err) {
      console.error('Error al eliminar mascota:', err);
    }
  };

  const actualizarMascota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editData) return;
    try {
      await updatePet({ ...editData, edad: parseInt(String(editData.edad)) }, token);
      setEditData(null);
      fetchMascotas();
    } catch (err) {
      console.error('Error al actualizar mascota:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-extrabold text-center text-[#4B3621] mb-10">🐶 Panel de Control - Patitas Felices</h1>

        {/* Botón para alternar formulario si hay mascotas */}
        {mascotas.length > 0 && !editData && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#B08968] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#936E4E] transition"
            >
              {showForm ? 'Volver a la lista' : 'Registrar nueva mascota'}
            </button>
          </div>
        )}

        {/* Mostrar formulario */}
        {showForm && (
          <form onSubmit={registrarMascota} className="bg-white p-8 rounded-2xl shadow-xl space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-center text-[#4B3621] mb-4">Registrar Nueva Mascota</h2>
            <input
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border border-[#EBD9C3] text-[#4B3621] placeholder:text-[#B08968] p-3 rounded-xl"
              required
            />
            <input
              name="tipo"
              placeholder="Tipo (Perro, Gato...)"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border border-[#EBD9C3] text-[#4B3621] placeholder:text-[#B08968] p-3 rounded-xl"
              required
            />
            <input
              name="edad"
              type="number"
              placeholder="Edad"
              value={formData.edad}
              onChange={handleChange}
              className="w-full border border-[#EBD9C3] text-[#4B3621] placeholder:text-[#B08968] p-3 rounded-xl"
              required
              min={0}
            />
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="w-full border border-[#EBD9C3] text-[#4B3621] p-3 rounded-xl"
              required
            >
              <option value="">Selecciona género</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            <button
              type="submit"
              className="w-full bg-[#B08968] text-white py-3 rounded-xl font-bold hover:bg-[#936E4E] transition"
            >
              Registrar Mascota
            </button>
          </form>
        )}

        {/* Mostrar tabla si NO está el formulario y NO hay edición */}
        {!showForm && !editData && mascotas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-[#4B3621] mb-6 text-center">Mascotas Registradas</h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F7E6D1] text-[#4B3621] uppercase text-sm">
                <tr>
                  <th className="p-3 text-center">Nombre</th>
                  <th className="p-3 text-center">Tipo</th>
                  <th className="p-3 text-center">Edad</th>
                  <th className="p-3 text-center">Género</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((m) => (
                  <tr key={m.id} className="border-t text-[#4B3621] hover:bg-[#FEF7EF] transition">
                    <td className="text-center p-3">{m.nombre}</td>
                    <td className="text-center p-3">{m.tipo}</td>
                    <td className="text-center p-3">{m.edad}</td>
                    <td className="text-center p-3">{m.genero}</td>
                    <td className="flex items-center justify-center p-3 space-x-2">
                      <button
                        onClick={() => setEditData(m)}
                        className="bg-[#A67B5B] text-white px-3 py-1 rounded hover:bg-[#8C6144]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarMascota(String(m.id))}
                        className="bg-[#C24E4E] text-white px-3 py-1 rounded hover:bg-[#9F3A3A]"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de edición */}
        {editData && (
          <div className="fixed inset-0 bg-[#4B3621]/20 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-semibold text-center text-[#4B3621] mb-4">Editar Mascota</h2>
              <form onSubmit={actualizarMascota} className="space-y-4">
                <input
                  name="nombre"
                  value={editData.nombre}
                  onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                  className="w-full border border-[#EBD9C3] p-3 rounded-xl text-[#4B3621]"
                />
                <input
                  name="tipo"
                  value={editData.tipo}
                  onChange={(e) => setEditData({ ...editData, tipo: e.target.value })}
                  className="w-full border border-[#EBD9C3] p-3 rounded-xl text-[#4B3621]"
                />
                <input
                  name="edad"
                  type="number"
                  value={editData.edad}
                  onChange={(e) => setEditData({ ...editData, edad: Number(e.target.value) })}
                  className="w-full border border-[#EBD9C3] p-3 rounded-xl text-[#4B3621]"
                />
                <select
                  name="genero"
                  value={editData.genero}
                  onChange={(e) => setEditData({ ...editData, genero: e.target.value })}
                  className="w-full border border-[#EBD9C3] p-3 rounded-xl text-[#4B3621]"
                >
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
                <div className="flex justify-between">
                  <button type="submit" className="bg-[#B08968] text-white px-4 py-2 rounded-xl hover:bg-[#936E4E]">
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditData(null)}
                    className="text-[#C24E4E] hover:text-red-700"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

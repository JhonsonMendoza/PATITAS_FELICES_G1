"use client";
import { useEffect, useState } from "react";
import {
  getVacunas,
  createVacuna,
  updateVacuna,
  deleteVacuna,
  Vacuna,
} from "@/apis/vacunas/route";
import { getPets, Pet } from "@/apis/mascotas/route";
import { useAuth } from "@/context/authContext";

export default function VacunasPage() {
  const { token } = useAuth();
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [mascotas, setMascotas] = useState<Pet[]>([]);
  const [formData, setFormData] = useState({
    mascotaId: "",
    nombre: "",
    fecha: "",
    observaciones: "",
  });
  const [editData, setEditData] = useState<Vacuna | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchVacunas = async () => {
    if (!token) return;
    try {
      const dataVacunas = await getVacunas(token);
      setVacunas(dataVacunas);
    } catch (error) {
      console.error("Error al obtener vacunas:", error);
      setVacunas([]);
    }
  };

  const fetchMascotas = async () => {
    if (!token) return;
    try {
      const dataMascotas = await getPets(token);
      setMascotas(Array.isArray(dataMascotas) ? dataMascotas : []);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      setMascotas([]);
    }
  };

  useEffect(() => {
    fetchVacunas();
    fetchMascotas();
  }, [token]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registrarVacuna = async (e: any) => {
    e.preventDefault();
    if (!token) return;
    try {
      await createVacuna(formData, token);
      setFormData({ mascotaId: "", nombre: "", fecha: "", observaciones: "" });
      fetchVacunas();
      setShowForm(false);
    } catch (error) {
      console.error("Error al registrar vacuna:", error);
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (!token || !editData) return;
    try {
      await updateVacuna(editData.id!, editData, token);
      setEditData(null);
      fetchVacunas();
    } catch (error) {
      console.error("Error al actualizar vacuna:", error);
    }
  };

  const confirmDelete = async () => {
    if (!token || !deleteId) return;
    try {
      await deleteVacuna(deleteId, token);
      setDeleteId(null);
      fetchVacunas();
    } catch (error) {
      console.error("Error al eliminar vacuna:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F1E3] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-[#4B3621] mb-8">
          💉 Control de Vacunas
        </h1>

        {showForm ? (
          <form
            onSubmit={registrarVacuna}
            className="bg-white p-6 rounded-2xl shadow-md space-y-4 mb-8"
          >
            <h2 className="text-xl font-semibold text-[#4B3621] text-center">
              Registrar Vacuna
            </h2>
            <select
              name="mascotaId"
              value={formData.mascotaId}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-700 p-3 rounded-xl"
              required
            >
              <option value="">Selecciona una mascota</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            <input
              name="nombre"
              placeholder="Nombre de la vacuna"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-700 p-3 rounded-xl"
              required
            />
      <label htmlFor="fecha" className="block text-sm font-medium text-[#4B3621]">Fecha</label>
<input
  id="fecha"
  name="fecha"
  type="date"
  value={formData.fecha}
  onChange={handleChange}
  className="w-full border border-gray-300 text-gray-700 p-3 rounded-xl"
  required
/>
            <textarea
              name="observaciones"
              placeholder="Observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-700 p-3 rounded-xl"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-[#8C6A4D] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#4B3621] transition"
              >
                Registrar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-[#C24E4E] hover:text-red-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#8C6A4D] text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#4B3621]"
            >
              Registrar Nueva Vacuna
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#4B3621] mb-4">
            Historial de Vacunas
          </h2>
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#F0E5D8] text-[#4B3621] text-sm uppercase">
              <tr>
                <th className="p-3">Mascota</th>
                <th>Vacuna</th>
                <th>Fecha</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacunas.map((v) => {
                const mascota = mascotas.find((m) => m.id === v.mascotaId);
                return (
                  <tr key={v.id} className="border-t text-gray-700">
                    <td className="p-3">{mascota?.nombre || "Desconocido"}</td>
                    <td>{v.nombre}</td>
                    <td>{v.fecha}</td>
                    <td>{v.observaciones}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => setEditData(v)}
                        className="bg-[#A67B5B] text-white px-3 py-1 rounded hover:bg-[#8C6144]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteId(v.id!)}
                        className="bg-[#C24E4E] text-white px-3 py-1 rounded hover:bg-[#9F3A3A]"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editData && (
          <div className="fixed inset-0 bg-[#4B3621]/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold text-center text-[#4B3621] mb-4">
                Editar Vacuna
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <select
                  name="mascotaId"
                  value={editData.mascotaId}
                  onChange={(e) =>
                    setEditData({ ...editData, mascotaId: e.target.value })
                  }
                  className="w-full border border-gray-300 text-gray-700 p-3 rounded-xl"
                  required
                >
                  {mascotas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                <input
                  name="nombre"
                  value={editData.nombre}
                  onChange={(e) =>
                    setEditData({ ...editData, nombre: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-xl text-[#4B3621]"
                />
            <label htmlFor="fecha-edit" className="block text-sm font-medium text-[#4B3621]">Fecha</label>
<input
  id="fecha-edit"
  name="fecha"
  type="date"
  value={editData.fecha}
  onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
  className="w-full border border-gray-300 p-3 rounded-xl text-[#4B3621]"
/>
                <textarea
                  name="observaciones"
                  value={editData.observaciones}
                  onChange={(e) =>
                    setEditData({ ...editData, observaciones: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-xl text-[#4B3621]"
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-[#B08968] text-white px-4 py-2 rounded-xl hover:bg-[#936E4E]"
                  >
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

        {deleteId && (
          <div className="fixed inset-0 bg-[#4B3621]/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
              <h2 className="text-xl font-semibold text-[#4B3621] mb-4">
                ¿Eliminar esta vacuna?
              </h2>
              <p className="text-gray-700 mb-6">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="bg-[#C24E4E] text-white px-4 py-2 rounded-xl hover:bg-[#9F3A3A]"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="text-gray-600 hover:text-[#4B3621]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { getEmpleados, desactivarEmpleado } from "../../services/empleadosService";
import type { Empleado } from "../../types/empleado";
import { Pencil, XCircle, CheckCircle, UserPlus, Search } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = {
  onCrear: () => void;
  onEditar: (emp: Empleado) => void;
  /** Si cambia, recarga la lista (forzado desde el padre) */
  reloadKey?: number;
};

const ListaEmpleados: React.FC<Props> = ({ onCrear, onEditar, reloadKey }) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState("");

  async function load() {
    setLoading(true);
    const data = await getEmpleados();
    setEmpleados(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reloadKey !== undefined) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return empleados;
    return empleados.filter(
      e =>
        e.nombre.toLowerCase().includes(q) ||
        e.apellido.toLowerCase().includes(q) ||
        e.correo.toLowerCase().includes(q)
    );
  }, [empleados, term]);

  const handleToggle = async (emp: Empleado) => {
    const ok = await desactivarEmpleado(emp.id, !emp.activo);
    if (!ok) {
      toast.error("No se pudo actualizar el estado ❌");
      return;
    }
    // Update local state sin recargar:
    setEmpleados(prev =>
      prev.map(e => (e.id === emp.id ? { ...e, activo: !e.activo } : e))
    );
    if (emp.activo) {
      toast.success("Empleado desactivado ✅");
    } else {
      toast.success("Empleado activado ✅");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-light text-gray-500">
        Cargando empleados...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-light flex flex-col items-center font-sans overflow-hidden">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 my-10">
        Administración de Empleados
      </h1>

      {/* Barra: buscador + botón */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-6 px-6 gap-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o correo..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          />
        </div>
        <button
          onClick={onCrear}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-medium shadow transition-all"
        >
          <UserPlus size={18} />
          Nuevo Empleado
        </button>
      </div>

      {/* Tabla con scroll vertical, sin horizontal */}
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="min-w-full text-center text-gray-800 border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold sticky top-0 z-10">
              <tr>
                <th className="py-3 px-2">Nombre</th>
                <th className="py-3 px-2">Apellido</th>
                <th className="py-3 px-2">DNI</th>
                <th className="py-3 px-2">Teléfono</th>
                <th className="py-3 px-2">Dirección</th>
                <th className="py-3 px-2">Fecha Nac.</th>
                <th className="py-3 px-2">Correo</th>
                <th className="py-3 px-2">Rol</th>
                <th className="py-3 px-2">Puesto</th>
                <th className="py-3 px-2">Salario</th>
                <th className="py-3 px-2">Fecha Ingreso</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-2 px-2">{e.nombre}</td>
                  <td className="py-2 px-2">{e.apellido}</td>
                  <td className="py-2 px-2">{e.dni}</td>
                  <td className="py-2 px-2">{e.telefono}</td>
                  <td className="py-2 px-2">{e.direccion}</td>
                  <td className="py-2 px-2">{new Date(e.fechaNac).toLocaleDateString()}</td>
                  <td className="py-2 px-2">{e.correo}</td>
                  <td className="py-2 px-2 capitalize">{e.rol}</td>
                  <td className="py-2 px-2">{e.puesto}</td>
                  <td className="py-2 px-2">${e.salario.toLocaleString()}</td>
                  <td className="py-2 px-2">{new Date(e.fechaIngreso).toLocaleDateString()}</td>
                  <td className="py-2 px-2">
                    {e.activo ? (
                      <span className="text-green-600 font-medium flex items-center justify-center gap-1">
                        Activo ✅
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium flex items-center justify-center gap-1">
                        Inactivo ❌
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 flex justify-center gap-2">
                    <button
                      onClick={() => onEditar(e)}
                      className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow transition-all"
                    >
                      <Pencil size={16} /> Editar
                    </button>

                    {e.activo ? (
                      <button
                        onClick={() => handleToggle(e)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition-all"
                      >
                        <XCircle size={16} /> Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggle(e)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow transition-all"
                      >
                        <CheckCircle size={16} /> Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No se encontraron empleados con ese criterio.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaEmpleados;

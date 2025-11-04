import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPacientes } from "../../services/pacientesService";
import type { Paciente } from "../../types/Paciente";

const PacientesPage: React.FC = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getPacientes();
      setPacientes(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return pacientes;
    const s = q.toLowerCase();
    return pacientes.filter((p) => {
      const nombre = p.persona.nombre.toLowerCase();
      const apellido = p.persona.apellido.toLowerCase();
      const correo = p.user?.correo?.toLowerCase() || "";
      const dni = p.persona.dni;
      return (
        nombre.includes(s) ||
        apellido.includes(s) ||
        correo.includes(s) ||
        dni.includes(q)
      );
    });
  }, [q, pacientes]);

  return (
    <div className="min-h-screen w-full bg-light text-gray-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-light border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
              Gestión de Pacientes
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Buscar por nombre, apellido, DNI o correo"
              className="flex-1 md:w-[420px] border border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Link
              to="/pacientes/nuevo"
              className="whitespace-nowrap bg-accent hover:bg-accent/90 text-white font-medium px-4 py-2 rounded-lg shadow"
            >
              Nuevo Paciente
            </Link>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
        <div className="bg-white rounded-xl shadow border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-secondary">
              Registros: <span className="font-semibold">{filtered.length}</span>
            </p>
          </div>

          <div className="overflow-x-hidden overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Cargando...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No se encontraron pacientes con ese criterio.
              </div>
            ) : (
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-sm text-gray-600">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Nombre</th>
                    <th className="py-3 px-4">Apellido</th>
                    <th className="py-3 px-4">DNI</th>
                    <th className="py-3 px-4">Teléfono</th>
                    <th className="py-3 px-4">Correo</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filtered.map((p) => (
                    <tr key={p.persona.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{p.persona.id}</td>
                      <td className="py-3 px-4">{p.persona.nombre}</td>
                      <td className="py-3 px-4">{p.persona.apellido}</td>
                      <td className="py-3 px-4">{p.persona.dni}</td>
                      <td className="py-3 px-4">{p.persona.telefono}</td>
                      <td className="py-3 px-4">{p.user?.correo || "-"}</td>
                      <td className="py-3 px-4">
                        {p.user?.activo ? (
                          <span className="text-green-600 font-medium">Activo</span>
                        ) : (
                          <span className="text-red-600 font-medium">Inactivo</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/pacientes/${p.persona.id}`)}
                            className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => navigate(`/pacientes/${p.persona.id}`)}
                            className="px-3 py-1.5 rounded-lg border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => navigate(`/pacientes/${p.persona.id}/citas`)}
                            className="px-3 py-1.5 rounded-lg border border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white transition"
                          >
                            Ver Citas
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/pacientes/${p.persona.id}/citas/nueva`)
                            }
                            className="px-3 py-1.5 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
                          >
                            Crear Cita
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacientesPage;

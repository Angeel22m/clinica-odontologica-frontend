import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      setPacientes(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  // ✅ Detectar si una columna tiene datos reales
  const colHas = {
    dni: pacientes.some((p) => !!p.dni?.trim()),
    telefono: pacientes.some((p) => !!p.telefono?.trim()),
    correo: pacientes.some((p) => !!p.correo?.trim()),
    direccion: pacientes.some((p) => !!p.direccion?.trim()),
    fechaNac: pacientes.some((p) => !!p.fechaNac?.trim()),
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return pacientes;

    const s = q.toLowerCase();

    return (pacientes ?? []).filter((p) => {
      const nombre = (p.nombre ?? "").toLowerCase();
      const apellido = (p.apellido ?? "").toLowerCase();
      const correo = (p.correo ?? "").toLowerCase();
      const dni = p.dni ?? "";
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
            Gestión de Pacientes con Expediente Creado
          </h1>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Buscar por nombre, apellido, DNI o correo"
              className="flex-1 md:w-[420px] border border-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={() => navigate("/pacientes/nuevo")}
              className="whitespace-nowrap bg-accent hover:bg-accent/90 text-white font-medium px-4 py-2 rounded-lg shadow"
            >
              Nuevo Paciente
            </button>
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
                    {colHas.dni && <th className="py-3 px-4">DNI</th>}
                    {colHas.telefono && <th className="py-3 px-4">Teléfono</th>}
                    {colHas.correo && <th className="py-3 px-4">Correo</th>}
                    {colHas.direccion && (
                      <th className="py-3 px-4">Dirección</th>
                    )}
                    {colHas.fechaNac && (
                      <th className="py-3 px-4">Nacimiento</th>
                    )}
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{p.id}</td>
                      <td className="py-3 px-4">{p.nombre || "-"}</td>
                      <td className="py-3 px-4">{p.apellido || "-"}</td>
                      {colHas.dni && <td className="py-3 px-4">{p.dni}</td>}
                      {colHas.telefono && (
                        <td className="py-3 px-4">{p.telefono}</td>
                      )}
                      {colHas.correo && (
                        <td className="py-3 px-4">{p.correo}</td>
                      )}
                      {colHas.direccion && (
                        <td className="py-3 px-4">{p.direccion}</td>
                      )}
                      {colHas.fechaNac && (
                        <td className="py-3 px-4">{p.fechaNac}</td>
                      )}

                      {/* Acciones */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/pacientes/${p.id}`)}
                            className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
                          >
                            Ver
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

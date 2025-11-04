import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelarCita,
  getCitasByPaciente,
  getDoctoresActivos,
  getServiciosActivos,
} from "../../services/citasService";
import type { Cita, EstadoCita } from "../../types/cita";
import type { DoctorBasic } from "../../types/doctor";
import type { ServicioClinico } from "../../types/servicioClinico";

const tabs: { key: EstadoCita | "TODAS"; label: string }[] = [
  { key: "PENDIENTE", label: "Pendientes" },
  { key: "COMPLETADA", label: "Completadas" },
  { key: "CANCELADA", label: "Canceladas" },
  { key: "TODAS", label: "Todas" },
];

function fmtFechaLocalA(fechaISO: string) {
  const d = new Date(fechaISO);
  const date = d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date} ${time}`;
}

const PacienteCitasPage: React.FC = () => {
  const { id } = useParams();
  const pacienteId = Number(id);
  const navigate = useNavigate();

  const [citas, setCitas] = useState<Cita[]>([]);
  const [doctores, setDoctores] = useState<DoctorBasic[]>([]);
  const [servicios, setServicios] = useState<ServicioClinico[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<EstadoCita | "TODAS">("PENDIENTE");
  const [confirmId, setConfirmId] = useState<number | null>(null); // para modal de confirmación

  useEffect(() => {
    if (!pacienteId) return;
    const load = async () => {
      try {
        const [c, d, s] = await Promise.all([
          getCitasByPaciente(pacienteId),
          getDoctoresActivos(),
          getServiciosActivos(),
        ]);
        setCitas(c);
        setDoctores(d);
        setServicios(s);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pacienteId]);

  const citasFiltradas = useMemo(() => {
    if (tab === "TODAS") return citas;
    return citas.filter((c) => c.estado === tab);
  }, [citas, tab]);

  const doctorName = (id: number) => {
    const d = doctores.find((x) => x.id === id);
    return d ? `${d.nombre} ${d.apellido}` : `Doctor ${id}`;
    };
  const servicioName = (id: number) => {
    const s = servicios.find((x) => x.id === id);
    return s ? s.nombre : `Servicio ${id}`;
  };

  const handleCancel = async (cid: number) => {
    setConfirmId(null);
    await cancelarCita(cid);
    const refreshed = await getCitasByPaciente(pacienteId);
    setCitas(refreshed);
  };

  return (
    <div className="min-h-screen w-full bg-light text-gray-900 flex flex-col">
      <div className="sticky top-0 z-10 bg-light border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Citas del Paciente</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/pacientes/${pacienteId}`)}
              className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
            >
              Volver
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 py-2 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg border ${
                tab === t.key
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
        <div className="bg-white rounded-xl shadow border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-secondary">
              Registros: <span className="font-semibold">{citasFiltradas.length}</span>
            </p>
          </div>

          <div className="overflow-x-hidden overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Cargando...</div>
            ) : citasFiltradas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No hay citas en esta categoría.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-gray-600">
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Servicio</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {citasFiltradas.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{fmtFechaLocalA(c.fecha)}</td>
                      <td className="py-3 px-4">{servicioName(c.servicioId)}</td>
                      <td className="py-3 px-4">{doctorName(c.doctorId)}</td>
                      <td className="py-3 px-4">
                        {c.estado === "PENDIENTE" && (
                          <span className="text-amber-600 font-medium">Pendiente</span>
                        )}
                        {c.estado === "COMPLETADA" && (
                          <span className="text-emerald-600 font-medium">Completada</span>
                        )}
                        {c.estado === "CANCELADA" && (
                          <span className="text-red-600 font-medium">Cancelada</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {c.estado === "PENDIENTE" ? (
                          <button
                            onClick={() => setConfirmId(c.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                          >
                            Cancelar
                          </button>
                        ) : (
                          <span className="text-gray-400">Sin acciones</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Botón flotante crear cita */}
      <button
        onClick={() => navigate(`/pacientes/${pacienteId}/citas/nueva`)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-white text-2xl shadow-lg"
        aria-label="Nueva cita"
        title="Nueva cita"
      >
        +
      </button>

      {/* Modal de confirmación */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow p-6 w-[90vw] max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirmar cancelación</h3>
            <p className="text-sm text-gray-600">
              ¿Deseas cancelar esta cita? Esta acción no elimina el registro, solo cambia su estado a cancelada.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Volver
              </button>
              <button
                onClick={() => handleCancel(confirmId)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Cancelar cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacienteCitasPage;

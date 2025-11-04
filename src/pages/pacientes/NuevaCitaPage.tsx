import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  crearCita,
  getDoctoresActivos,
  getServiciosActivos,
} from "../../services/citasService";
import type { DoctorBasic } from "../../types/doctor";
import type { ServicioClinico } from "../../types/servicioClinico";

function toLocalDateTimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

const NuevaCitaPage: React.FC = () => {
  const { id } = useParams();
  const pacienteId = Number(id);
  const navigate = useNavigate();

  const [doctores, setDoctores] = useState<DoctorBasic[]>([]);
  const [servicios, setServicios] = useState<ServicioClinico[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<{ fecha: string; servicio: string; doctor: string } | null>(null);

  const [form, setForm] = useState({
    fecha: toLocalDateTimeValue(new Date(Date.now() + 60 * 60 * 1000)), // 1h adelante
    doctorId: 0,
    servicioId: 0,
    motivo: "",
    observaciones: "",
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const [d, s] = await Promise.all([getDoctoresActivos(), getServiciosActivos()]);
      setDoctores(d);
      setServicios(s);
      if (d.length && !form.doctorId) setForm((f) => ({ ...f, doctorId: d[0].id }));
      if (s.length && !form.servicioId) setForm((f) => ({ ...f, servicioId: s[0].id }));
    };
    load();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value } as any));
    setErrores((e) => ({ ...e, [field]: "" }));
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.fecha) e.fecha = "Requerido";
    if (!form.doctorId) e.doctorId = "Requerido";
    if (!form.servicioId) e.servicioId = "Requerido";

    const dt = new Date(form.fecha);
    if (isNaN(dt.getTime())) e.fecha = "Fecha/hora inválida";
    if (dt.getTime() < Date.now()) e.fecha = "No puede ser pasada";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const doctorName = (id: number) => {
    const d = doctores.find((x) => x.id === id);
    return d ? `${d.nombre} ${d.apellido}` : `Doctor ${id}`;
  };
  const servicioName = (id: number) => {
    const s = servicios.find((x) => x.id === id);
    return s ? s.nombre : `Servicio ${id}`;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;

    try {
      setSaving(true);
      const creada = await crearCita({
        pacienteId,
        doctorId: form.doctorId,
        servicioId: form.servicioId,
        fecha: new Date(form.fecha).toISOString(),
        motivo: form.motivo || undefined,
        observaciones: form.observaciones || undefined,
      });

      setConfirm({
        fecha: new Date(creada.fecha).toLocaleString(),
        servicio: servicioName(creada.servicioId),
        doctor: doctorName(creada.doctorId),
      });
    } catch (err: any) {
      alert(err?.message || "No se pudo crear la cita");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-light text-gray-900 flex flex-col">
      <div className="sticky top-0 z-10 bg-light border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Nueva Cita</h1>
          <button
            onClick={() => navigate(`/pacientes/${pacienteId}/citas`)}
            className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Fecha y hora *</label>
              <input
                type="datetime-local"
                className="w-full border rounded-lg px-3 py-2"
                value={form.fecha}
                onChange={(e) => handleChange("fecha", e.target.value)}
              />
              {errores.fecha && <p className="text-xs text-red-600 mt-1">{errores.fecha}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">Doctor *</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.doctorId}
                onChange={(e) => handleChange("doctorId", Number(e.target.value))}
              >
                {doctores.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre} {d.apellido}
                  </option>
                ))}
              </select>
              {errores.doctorId && <p className="text-xs text-red-600 mt-1">{errores.doctorId}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">Servicio *</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.servicioId}
                onChange={(e) => handleChange("servicioId", Number(e.target.value))}
              >
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              {errores.servicioId && (
                <p className="text-xs text-red-600 mt-1">{errores.servicioId}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Motivo</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.motivo}
                onChange={(e) => handleChange("motivo", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Observaciones</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                value={form.observaciones}
                onChange={(e) => handleChange("observaciones", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/pacientes/${pacienteId}/citas`)}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white"
            >
              {saving ? "Guardando..." : "Guardar cita"}
            </button>
          </div>

          {/* Modal post-crear (postcrear: C) */}
          {confirm && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow p-6 w-[90vw] max-w-md">
                <h3 className="text-lg font-semibold mb-2">Cita creada correctamente</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Fecha: <span className="font-medium">{confirm.fecha}</span></p>
                  <p>Servicio: <span className="font-medium">{confirm.servicio}</span></p>
                  <p>Doctor: <span className="font-medium">{confirm.doctor}</span></p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setConfirm(null)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Seguir aquí
                  </button>
                  <button
                    onClick={() => navigate(`/pacientes/${pacienteId}/citas`)}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white"
                  >
                    Ir a la lista
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            Guardado actual: Mock + localStorage. Para usar backend real, reemplaza el llamado en
            crearCita por la versión con fetch hacia /api/citas.
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaCitaPage;

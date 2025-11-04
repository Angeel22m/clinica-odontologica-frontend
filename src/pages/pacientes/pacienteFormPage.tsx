import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearPaciente, getPacientes } from "../../services/pacientesService";

const PacienteFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: "",
  });

  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState<{ correo?: string; password?: string } | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrores((e) => ({ ...e, [field]: "" }));
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.apellido.trim()) e.apellido = "Requerido";
    if (!form.dni.trim()) e.dni = "Requerido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    if (!form.fechaNac.trim()) e.fechaNac = "Requerido";
    if (!form.correo.trim()) e.correo = "Requerido";

    if (form.dni && form.dni.replace(/\D/g, "").length !== 13) {
      e.dni = "DNI debe tener 13 dígitos";
    }

    if (form.telefono && form.telefono.replace(/\D/g, "").length !== 8) {
      e.telefono = "Teléfono debe tener 8 dígitos";
    }

    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      e.correo = "Correo inválido";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;

    try {
      setSaving(true);
      // Crear paciente + user (mock + localStorage). Hemos actualizado el service para devolver el creado.
      const creado = await crearPaciente({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.replace(/\D/g, ""),
        telefono: form.telefono.replace(/\D/g, ""),
        direccion: form.direccion.trim(),
        fechaNac: form.fechaNac,
        correo: form.correo.trim().toLowerCase(),
      });

      // Mostrar credenciales generadas
      setMensaje({
        correo: creado.user.correo,
        password: creado.user.password,
      });

      // Opcional: refrescar cache local
      await getPacientes();
    } catch (err: any) {
      alert(err?.message || "No se pudo registrar el paciente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-light text-gray-900 flex flex-col">
      <div className="sticky top-0 z-10 bg-light border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
            Nuevo Paciente
          </h1>
          <button
            onClick={() => navigate("/pacientes")}
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
            <div>
              <label className="text-sm text-gray-600">Nombre *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
              {errores.nombre && (
                <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Apellido *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
              />
              {errores.apellido && (
                <p className="text-xs text-red-600 mt-1">{errores.apellido}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">DNI *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0801-1990-00001"
                value={form.dni}
                onChange={(e) => handleChange("dni", e.target.value)}
              />
              {errores.dni && (
                <p className="text-xs text-red-600 mt-1">{errores.dni}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Teléfono *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="+504 9999-8888"
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
              {errores.telefono && (
                <p className="text-xs text-red-600 mt-1">{errores.telefono}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Dirección</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Fecha de nacimiento *</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.fechaNac}
                onChange={(e) => handleChange("fechaNac", e.target.value)}
              />
              {errores.fechaNac && (
                <p className="text-xs text-red-600 mt-1">{errores.fechaNac}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Correo *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="cliente@mail.com"
                value={form.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
              />
              {errores.correo && (
                <p className="text-xs text-red-600 mt-1">{errores.correo}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/pacientes")}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>

          {mensaje && (
            <div className="mt-4 p-4 rounded-lg border border-emerald-300 bg-emerald-50">
              <p className="font-semibold text-emerald-700">Paciente registrado correctamente.</p>
              <p className="text-sm text-emerald-700">
                Usuario: <span className="font-mono">{mensaje.correo}</span>
              </p>
              <p className="text-sm text-emerald-700">
                Contraseña generada: <span className="font-mono">{mensaje.password}</span>
              </p>
            </div>
          )}

          {/* Nota de backend */}
          <div className="mt-2 text-xs text-gray-500">
            Guardado actual: Mock + localStorage. Para usar backend real, reemplaza el llamado en
            crearPaciente por la versión con fetch hacia /api/pacientes (comentada en el service).
          </div>
        </form>
      </div>
    </div>
  );
};

export default PacienteFormPage;

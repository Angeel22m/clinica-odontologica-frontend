import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearPaciente, getPacientes } from "../../services/pacientesService";

// Formatea DNI en vivo: 0801-1990-00001 (4-4-5)
function formatDNILive(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 13);
  const p1 = d.slice(0, 4);
  const p2 = d.slice(4, 8);
  const p3 = d.slice(8, 13);
  if (d.length <= 4) return p1;
  if (d.length <= 8) return `${p1}-${p2}`;
  return `${p1}-${p2}-${p3}`;
}

// Normaliza DNI a solo 13 dígitos
function normalizeDNI(value: string): string {
  return value.replace(/\D/g, "").slice(0, 13);
}

// Formatea teléfono en vivo (acepta +504/504 y guiones), muestra 9999-9999
function formatPhoneLive(value: string): string {
  // dejamos escribir +504 o 504, pero mostramos 8 dígitos formateados si existen
  const digits = value.replace(/\D/g, "");
  let local = digits;

  if (local.startsWith("504")) local = local.slice(3);
  if (local.length > 8) local = local.slice(0, 8);

  if (local.length <= 4) return local;
  return `${local.slice(0, 4)}-${local.slice(4)}`;
}

// Normaliza teléfono a 8 dígitos sin prefijo
function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("504")) digits = digits.slice(3);
  return digits.slice(0, 8);
}

// Validaciones simples
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidDNI(dniDigits: string): boolean {
  return /^\d{13}$/.test(dniDigits);
}
function isValidPhoneIfPresent(phoneDigits: string): boolean {
  if (!phoneDigits) return true; // opcional
  return /^\d{8}$/.test(phoneDigits);
}

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
    let v = value;
    if (field === "dni") v = formatDNILive(value);
    if (field === "telefono") v = formatPhoneLive(value);

    setForm((f) => ({ ...f, [field]: v }));
    setErrores((e) => ({ ...e, [field]: "" }));
  };

  // Reglas de requerido y formato (sin consultar duplicados aún)
  const validarCampos = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.apellido.trim()) e.apellido = "Requerido";
    if (!form.dni.trim()) e.dni = "Requerido";
    if (!form.direccion.trim()) e.direccion = "Requerido";
    if (!form.fechaNac.trim()) e.fechaNac = "Requerido";
    if (!form.correo.trim()) e.correo = "Requerido";

    const dniDigits = normalizeDNI(form.dni);
    if (form.dni && !isValidDNI(dniDigits)) {
      e.dni = "DNI debe tener 13 dígitos";
    }

    const phoneDigits = normalizePhone(form.telefono);
    if (form.telefono && !isValidPhoneIfPresent(phoneDigits)) {
      e.telefono = "Teléfono debe tener 8 dígitos";
    }

    if (form.correo && !isValidEmail(form.correo.trim().toLowerCase())) {
      e.correo = "Correo inválido";
    }

    // fecha no futura
    if (form.fechaNac) {
      const dt = new Date(form.fechaNac);
      if (isNaN(dt.getTime())) {
        e.fechaNac = "Fecha inválida";
      } else if (dt.getTime() > Date.now()) {
        e.fechaNac = "No puede ser futura";
      }
    }

    return e;
  };

  // Botón Guardar deshabilitado hasta que no haya errores básicos y requeridos completos
  const puedeGuardar = useMemo(() => {
    const e = validarCampos();
    return Object.keys(e).length === 0 && !saving;
  }, [form, saving]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    // 1) Validación de requeridos y formato
    const eBase = validarCampos();
    if (Object.keys(eBase).length > 0) {
      setErrores(eBase);
      return;
    }

    // 2) Validación de duplicados en mock
    const dniDigits = normalizeDNI(form.dni);
    const phoneDigits = normalizePhone(form.telefono);
    const correo = form.correo.trim().toLowerCase();

    const existentes = await getPacientes();
    const dniUsado = existentes.some((p) => p.dni === dniDigits);
    //const correoUsado = existentes.some((p) => p.correo.toLowerCase() === correo);
    const telUsado = phoneDigits ? existentes.some((p) => (p.telefono || "") === phoneDigits) : false;

    const eDup: Record<string, string> = {};
    if (dniUsado) eDup.dni = "DNI ya registrado";
   // if (correoUsado) eDup.correo = "Correo ya registrado";
    if (telUsado) eDup.telefono = "Teléfono ya registrado";

    if (Object.keys(eDup).length > 0) {
      setErrores((prev) => ({ ...prev, ...eDup }));
      return;
    }

    // 3) Guardar
    try {
      setSaving(true);
      const creado = await crearPaciente({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: dniDigits,
        telefono: phoneDigits || "", // opcional
        direccion: form.direccion.trim(),
        fechaNac: form.fechaNac,
        correo,
      });

      setMensaje({
        correo: creado.user.correo,
        password: creado.user.password,
      });

      // Mantenerse en la página y limpiar formulario
      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        direccion: "",
        fechaNac: "",
        correo: "",
      });
      setErrores({});
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Nuevo Paciente</h1>
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
            {/* Nombre */}
            <div>
              <label className="text-sm text-gray-600">Nombre *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
              {errores.nombre && <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className="text-sm text-gray-600">Apellido *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
              />
              {errores.apellido && <p className="text-xs text-red-600 mt-1">{errores.apellido}</p>}
            </div>

            {/* DNI */}
            <div>
              <label className="text-sm text-gray-600">DNI *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0801-1990-00001"
                value={form.dni}
                onChange={(e) => handleChange("dni", e.target.value)}
              />
              {errores.dni && <p className="text-xs text-red-600 mt-1">{errores.dni}</p>}
            </div>

            {/* Teléfono (opcional) */}
            <div>
              <label className="text-sm text-gray-600">Teléfono</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="+504 9999-8888"
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
              {errores.telefono && <p className="text-xs text-red-600 mt-1">{errores.telefono}</p>}
            </div>

            {/* Dirección (obligatoria) */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Dirección *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
              {errores.direccion && <p className="text-xs text-red-600 mt-1">{errores.direccion}</p>}
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="text-sm text-gray-600">Fecha de nacimiento *</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.fechaNac}
                onChange={(e) => handleChange("fechaNac", e.target.value)}
              />
              {errores.fechaNac && <p className="text-xs text-red-600 mt-1">{errores.fechaNac}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="text-sm text-gray-600">Correo *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="cliente@mail.com"
                value={form.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
              />
              {errores.correo && <p className="text-xs text-red-600 mt-1">{errores.correo}</p>}
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
              disabled={!puedeGuardar}
              className={`px-4 py-2 rounded-lg text-white ${puedeGuardar ? "bg-accent hover:bg-accent/90" : "bg-gray-400 cursor-not-allowed"}`}
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

          <div className="mt-2 text-xs text-gray-500">
            Guardado actual: Mock + localStorage. Para usar backend real, descomenta el fetch en el service.
          </div>
        </form>
      </div>
    </div>
  );
};

export default PacienteFormPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearPacienteConUsuario, existeDNI, existeCorreo } from "../../services/pacientesService";
import { validarCorreo, validarDNI, validarTelefono, normalizarTelefono, normalizarDNI } from "../../utils/validaciones";
import { toast } from "react-hot-toast";

const NuevoPaciente: React.FC = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: ""
  });
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: ""
  });
  const [saving, setSaving] = useState(false);

  const onChange = (k: keyof typeof form, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const validar = async (): Promise<boolean> => {
    const e = { ...errors };

    e.nombre = form.nombre.trim() ? "" : "Requerido";
    e.apellido = form.apellido.trim() ? "" : "Requerido";
    e.dni = validarDNI(form.dni) ? "" : "DNI inválido";
    e.telefono = validarTelefono(form.telefono) ? "" : "Teléfono inválido";
    e.direccion = form.direccion.trim() ? "" : "Requerido";
    e.fechaNac = form.fechaNac ? "" : "Requerido";
    e.correo = validarCorreo(form.correo) ? "" : "Correo inválido";

    // duplicados
    if (!e.dni && await existeDNI(form.dni)) e.dni = "Ya existe un paciente con ese DNI";
    if (!e.correo && await existeCorreo(form.correo)) e.correo = "Ya existe un paciente con ese correo";

    setErrors(e);
    return Object.values(e).every(x => x === "");
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (saving) return;

    const ok = await validar();
    if (!ok) {
      toast.error("Revisa los errores del formulario");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: normalizarDNI(form.dni),
        telefono: normalizarTelefono(form.telefono),
        direccion: form.direccion.trim(),
        fechaNac: form.fechaNac,
        correo: form.correo.trim().toLowerCase()
      };

      const { persona, passwordGenerada } = await crearPacienteConUsuario(payload);

      toast.success(`Paciente registrado. Contraseña temporal: ${passwordGenerada}`);
      nav(`/pacientes/${persona.id}`);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo registrar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-grisClaro text-primario p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-card p-6">
        <h1 className="text-3xl font-bold mb-4">Nuevo Paciente</h1>

        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <input className={`border p-2 rounded ${errors.nombre ? "border-red-500" : "border-primario/20"}`} placeholder="Nombre" value={form.nombre} onChange={e => onChange("nombre", e.target.value)} />
          <input className={`border p-2 rounded ${errors.apellido ? "border-red-500" : "border-primario/20"}`} placeholder="Apellido" value={form.apellido} onChange={e => onChange("apellido", e.target.value)} />
          {errors.nombre && <p className="text-xs text-red-500 col-span-1">{errors.nombre}</p>}
          {errors.apellido && <p className="text-xs text-red-500 col-span-1">{errors.apellido}</p>}

          <input className={`border p-2 rounded col-span-1 ${errors.dni ? "border-red-500" : "border-primario/20"}`} placeholder="DNI" value={form.dni} onChange={e => onChange("dni", e.target.value)} />
          <input className={`border p-2 rounded col-span-1 ${errors.telefono ? "border-red-500" : "border-primario/20"}`} placeholder="Teléfono" value={form.telefono} onChange={e => onChange("telefono", e.target.value)} />
          {errors.dni && <p className="text-xs text-red-500 col-span-1">{errors.dni}</p>}
          {errors.telefono && <p className="text-xs text-red-500 col-span-1">{errors.telefono}</p>}

          <input className={`border p-2 rounded col-span-2 ${errors.direccion ? "border-red-500" : "border-primario/20"}`} placeholder="Dirección" value={form.direccion} onChange={e => onChange("direccion", e.target.value)} />
          {errors.direccion && <p className="text-xs text-red-500 col-span-2">{errors.direccion}</p>}

          <label className="text-sm text-primario/70 mt-1">Fecha de nacimiento</label>
          <input type="date" className={`border p-2 rounded ${errors.fechaNac ? "border-red-500" : "border-primario/20"}`} value={form.fechaNac} onChange={e => onChange("fechaNac", e.target.value)} />
          {errors.fechaNac && <p className="text-xs text-red-500 col-span-2">{errors.fechaNac}</p>}

          <input className={`border p-2 rounded col-span-2 ${errors.correo ? "border-red-500" : "border-primario/20"}`} placeholder="Correo" type="email" value={form.correo} onChange={e => onChange("correo", e.target.value)} />
          {errors.correo && <p className="text-xs text-red-500 col-span-2">{errors.correo}</p>}

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => nav("/pacientes")} className="px-4 py-2 rounded bg-primario text-white hover:bg-primario/90">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className={`px-4 py-2 rounded ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-celeste2 hover:bg-celeste"} text-white`}>
              Guardar paciente
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-primario/60">
          Guardado actual: Mock JSON. Para usar API real, cambia las llamadas en pacientesService.ts.
        </div>
      </div>
    </div>
  );
};

export default NuevoPaciente;

import { useState, useEffect } from "react";
import type { CrearEmpleadoDTO, ActualizarEmpleadoDTO, EmpleadoResponse } from "../types/empleado";
import { crearEmpleado, actualizarEmpleado } from "../services/empleadosService";

type Props = {
  visible: boolean;
  onClose: () => void;
  empleadoSeleccionado: EmpleadoResponse | null;
  onSaved: () => void;
};

const puestos = ["DOCTOR", "RECEPCIONISTA", "ADMINISTRADOR"];

export default function EmpleadoModal({
  visible,
  onClose,
  empleadoSeleccionado,
  onSaved,
}: Props) {
  const [formData, setFormData] = useState<CrearEmpleadoDTO>({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: "",
    password: "",
    puesto: "DOCTOR",
    salario: 0,
    fechaIngreso: "",
    activo: true,
    usuarioActivo: true,
  });

  useEffect(() => {
    if (empleadoSeleccionado) {
      setFormData({
        nombre: empleadoSeleccionado.persona.nombre,
        apellido: empleadoSeleccionado.persona.apellido,
        dni: empleadoSeleccionado.persona.dni,
        telefono: empleadoSeleccionado.persona.telefono,
        direccion: empleadoSeleccionado.persona.direccion,
        fechaNac: empleadoSeleccionado.persona.fechaNac.split("T")[0],
        correo: "",
        password: "",
        puesto: empleadoSeleccionado.puesto,
        salario: empleadoSeleccionado.salario,
        fechaIngreso: empleadoSeleccionado.fechaIngreso.split("T")[0],
        activo: empleadoSeleccionado.activo,
        usuarioActivo: empleadoSeleccionado.activo,
      });
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        direccion: "",
        fechaNac: "",
        correo: "",
        password: "",
        puesto: "DOCTOR",
        salario: 0,
        fechaIngreso: "",
        activo: true,
        usuarioActivo: true,
      });
    }
  }, [empleadoSeleccionado]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload: any = { ...formData };
      payload.salario = Number(payload.salario);
      payload.puesto = payload.puesto || "DOCTOR";

      if (empleadoSeleccionado) {
        // eliminar campos no usados en edición
        delete payload.correo;
        delete payload.password;
       await actualizarEmpleado(empleadoSeleccionado.personaId, payload as ActualizarEmpleadoDTO);

      } else {
        await crearEmpleado(payload as CrearEmpleadoDTO);
      }

      onSaved();
      onClose();
    } catch (error: any) {
  const mensaje = error.response?.data?.message;

  if (Array.isArray(mensaje)) {
    alert(mensaje.join("\n"));
  } else {
    alert(mensaje || "Error al guardar empleado");
    console.error("Error al guardar empleado:", error);
  }
}
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl w-full max-w-4xl p-8 shadow-2xl border border-gray-300">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6 border-b pb-3">
      <h2 className="text-2xl font-extrabold text-gray-800">
        {empleadoSeleccionado ? "Editar Empleado" : "Nuevo Empleado"}
      </h2>
      <button
        onClick={onClose}
        className="px-3 py-1 rounded-lg hover:bg-gray-200 text-gray-700 text-lg"
      >
        ✕
      </button>
    </div>

    {/* FORM SCROLLABLE AREA */}
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">

      {/* --- DATOS PERSONALES --- */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos Personales</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-600">Nombre *</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Apellido *</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">DNI *</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="XXXX-XXXX-XXXXX"
              value={formData.dni}
              onChange={(e) => handleChange("dni", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Teléfono *</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="+504 XXXX-XXXX"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Dirección *</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Dirección completa"
              value={formData.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Fecha de nacimiento *</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.fechaNac}
              onChange={(e) => handleChange("fechaNac", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* --- DATOS EMPLEADO --- */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos del Empleado</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-600">Puesto *</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.puesto}
              onChange={(e) => handleChange("puesto", e.target.value)}
            >
              {puestos.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Salario *</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Ej: 25000"
              value={formData.salario}
              onChange={(e) => handleChange("salario", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Fecha de contratación *</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.fechaIngreso}
              onChange={(e) => handleChange("fechaIngreso", e.target.value)}
            />
          </div>

          {empleadoSeleccionado && (
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => handleChange("activo", e.target.checked)}
              />
              <span className="text-sm text-gray-700">Empleado Activo</span>
            </div>
          )}
        </div>
      </section>

      {/* --- CREDENCIALES SOLO CREAR --- */}
      {!empleadoSeleccionado && (
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos de usuario</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Correo *</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="correo@ejemplo.com"
                value={formData.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Contraseña *</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="********"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
          </div>
        </section>
      )}

    </div>

    {/* FOOTER BUTTONS */}
    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        Cancelar
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        Guardar
      </button>
    </div>

  </div>
</div>


  );
}

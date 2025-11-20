import { useState, useEffect } from "react";
import type { CrearEmpleadoDTO, ActualizarEmpleadoDTO, EmpleadoResponse } from "../types/empleado";
import { crearEmpleado, actualizarEmpleado } from "../services/empleadosService";
import { validarEmpleadoPorCampo } from "../utils/ValidacionesEmpleado";

type Props = {
  visible: boolean;
  onClose: () => void;
  empleadoSeleccionado: EmpleadoResponse | null;
  onSaved: () => void;
};

const puestos = ["DOCTOR", "RECEPCIONISTA", "ADMIN"];

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

  const [erroresCampos, setErroresCampos] = useState<Record<string, string>>({});

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

    setErroresCampos({});
  }, [empleadoSeleccionado]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validación en tiempo real
    const nuevosErrores = validarEmpleadoPorCampo(
      { ...formData, [field]: value },
      !!empleadoSeleccionado
    );
    setErroresCampos(nuevosErrores);
  };

  const handleSubmit = async () => {
    const errores = validarEmpleadoPorCampo(formData, !!empleadoSeleccionado);
    setErroresCampos(errores);

    if (Object.keys(errores).length > 0) return;

    try {
      const payload: any = { ...formData };
      payload.salario = Number(payload.salario);
      payload.puesto = payload.puesto || "DOCTOR";

      if (empleadoSeleccionado) {
        delete payload.correo;
        delete payload.password;

        await actualizarEmpleado(
          empleadoSeleccionado.personaId,
          payload as ActualizarEmpleadoDTO
        );
      } else {
        await crearEmpleado(payload as CrearEmpleadoDTO);
      }

      onSaved();
      onClose();
    } catch (error: any) {
      console.error("Error al guardar empleado:", error);
      alert("Error al guardar empleado");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 overlay-dark flex items-center justify-center z-50">
      <div className="bg-light rounded-xl w-full max-w-4xl p-8 shadow-2xl border border-primary/10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b border-primary/10 pb-3">
          <h2 className="text-2xl font-extrabold text-primary">
            {empleadoSeleccionado ? "Editar Empleado" : "Nuevo Empleado"}
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg hover:bg-accent/10 text-primary text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 text-primary">

          {/* DATOS PERSONALES */}
          <section>
            <h3 className="text-lg font-semibold text-primary mb-4">Datos Personales</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* NOMBRE */}
              <div>
                <label className="text-sm font-medium text-primary/70">Nombre *</label>
                <input
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.nombre ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                />
                {erroresCampos.nombre && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.nombre}</p>
                )}
              </div>

              {/* APELLIDO */}
              <div>
                <label className="text-sm font-medium text-primary/70">Apellido *</label>
                <input
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.apellido ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                />
                {erroresCampos.apellido && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.apellido}</p>
                )}
              </div>

              {/* DNI */}
              <div>
                <label className="text-sm font-medium text-primary/70">DNI *</label>
                <input
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.dni ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  placeholder="XXXXXXXXXXXXX"
                  value={formData.dni}
                  onChange={(e) => handleChange("dni", e.target.value)}
                />
                {erroresCampos.dni && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.dni}</p>
                )}
              </div>

              {/* TELEFONO */}
              <div>
                <label className="text-sm font-medium text-primary/70">Teléfono *</label>
                <input
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.telefono ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  placeholder="XXXX-XXXX"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                />
                {erroresCampos.telefono && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.telefono}</p>
                )}
              </div>

              {/* DIRECCION */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-primary/70">Dirección *</label>
                <input
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.direccion ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  placeholder="Dirección completa"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                />
                {erroresCampos.direccion && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.direccion}</p>
                )}
              </div>

              {/* FECHA NAC */}
              <div>
                <label className="text-sm font-medium text-primary/70">Fecha de nacimiento *</label>
                <input
                  type="date"
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.fechaNac ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  value={formData.fechaNac}
                  onChange={(e) => handleChange("fechaNac", e.target.value)}
                />
                {erroresCampos.fechaNac && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.fechaNac}</p>
                )}
              </div>
            </div>
          </section>

          {/* DATOS DEL EMPLEADO */}
          <section>
            <h3 className="text-lg font-semibold text-primary mb-4">Datos del Empleado</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* PUESTO */}
              <div>
                <label className="text-sm font-medium text-primary/70">Puesto *</label>
                <select
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1 bg-light text-primary focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition"
                  value={formData.puesto}
                  onChange={(e) => handleChange("puesto", e.target.value)}
                >
                  {puestos.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* SALARIO */}
              <div>
                <label className="text-sm font-medium text-primary/70">Salario *</label>
                <input
                  type="number"
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.salario ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  placeholder="Ej: 25000"
                  value={formData.salario}
                  onChange={(e) => handleChange("salario", e.target.value)}
                />
                {erroresCampos.salario && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.salario}</p>
                )}
              </div>

              {/* FECHA INGRESO */}
              <div>
                <label className="text-sm font-medium text-primary/70">Fecha de contratación *</label>
                <input
                  type="date"
                  className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                    ${erroresCampos.fechaIngreso ? "border-alert" : "border-primary/20"} 
                    focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                  value={formData.fechaIngreso}
                  onChange={(e) => handleChange("fechaIngreso", e.target.value)}
                />
                {erroresCampos.fechaIngreso && (
                  <p className="text-alert text-xs mt-1">{erroresCampos.fechaIngreso}</p>
                )}
              </div>

              {empleadoSeleccionado && (
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => handleChange("activo", e.target.checked)}
                  />
                  <span className="text-sm text-primary/70">Empleado Activo</span>
                </div>
              )}
            </div>
          </section>

          {/* DATOS USUARIO SOLO AL CREAR */}
          {!empleadoSeleccionado && (
            <section>
              <h3 className="text-lg font-semibold text-primary mb-4">Datos de usuario</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* CORREO */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-primary/70">Correo *</label>
                  <input
                    className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                      ${erroresCampos.correo ? "border-alert" : "border-primary/20"} 
                      focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                    placeholder="correo@ejemplo.com"
                    value={formData.correo}
                    onChange={(e) => handleChange("correo", e.target.value)}
                  />
                  {erroresCampos.correo && (
                    <p className="text-alert text-xs mt-1">{erroresCampos.correo}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-primary/70">Contraseña *</label>
                  <input
                    type="password"
                    className={`w-full border rounded-lg px-3 py-2 mt-1 bg-light text-primary 
                      ${erroresCampos.password ? "border-alert" : "border-primary/20"} 
                      focus:outline-none focus:border-info focus:ring-2 focus:ring-info/30 transition`}
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                  {erroresCampos.password && (
                    <p className="text-alert text-xs mt-1">{erroresCampos.password}</p>
                  )}
                </div>
              </div>
            </section>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6 border-t border-primary/10 pt-4">
          <button
            onClick={onClose}
            className="btn-primary bg-primary/10 text-primary hover:bg-primary/20"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary bg-success text-light hover:bg-success/90"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}

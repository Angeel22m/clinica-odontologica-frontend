// src/components/EmpleadoModal.tsx

import { useState, useEffect } from "react";
import type {
  CrearEmpleadoDTO,
  ActualizarEmpleadoDTO,
  EmpleadoResponse,
} from "../types/empleado";

import {
  crearEmpleado,
  actualizarEmpleado,
} from "../services/empleadosService";

import {
  limpiarDNI,
  limpiarTelefono,
  validarEmpleadoCampos,
} from "../utils/validacionesEmpleado";

import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";

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
  const hoy = new Date().toISOString().split("T")[0];

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
    fechaIngreso: hoy,
    activo: true,
    usuarioActivo: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [intentadoGuardar, setIntentadoGuardar] = useState(false);

  // Notificaciones
  const [notification, setNotification] = useState("");

  // Confirmaciones
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(
    null
  );
  const [confirmMessage, setConfirmMessage] = useState("");

  // Cargar datos si es edición
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
    }
  }, [empleadoSeleccionado]);

  // Manejar cambios
  const handleChange = (field: string, value: any) => {
    let nuevoValor = value;

    if (field === "dni") nuevoValor = limpiarDNI(value);
    if (field === "telefono") nuevoValor = limpiarTelefono(value);

    const actualizado = { ...formData, [field]: nuevoValor };
    setFormData(actualizado);

    if (intentadoGuardar) {
      setErrores(
        validarEmpleadoCampos(actualizado, !!empleadoSeleccionado)
      );
    }
  };

  // Guardar
  const trySave = async () => {
    setIntentadoGuardar(true);

    const val = validarEmpleadoCampos(
      formData,
      !!empleadoSeleccionado
    );

    setErrores(val);
    if (Object.keys(val).length > 0) return;

    const accionGuardar = async () => {
      try {
        const payload: any = { ...formData };
        payload.dni = limpiarDNI(payload.dni);
        payload.telefono = limpiarTelefono(payload.telefono);
        payload.salario = Number(payload.salario);

        if (payload.puesto === "ADMINISTRADOR") {
          payload.rol = "ADMIN";
        }

        if (empleadoSeleccionado) {
          delete payload.correo;
          delete payload.password;

          await actualizarEmpleado(
            empleadoSeleccionado.personaId,
            payload as ActualizarEmpleadoDTO
          );

          setNotification("Cambios guardados correctamente");
        } else {
          await crearEmpleado(payload as CrearEmpleadoDTO);
          setNotification("Empleado creado con éxito");
        }

        onSaved();
        onClose();
      } catch (error: any) {
        setNotification(
          error.response?.data?.message || "Error al guardar empleado"
        );
      }
    };

    if (empleadoSeleccionado) {
      setConfirmAction(() => accionGuardar);
      setConfirmMessage("¿Desea guardar los cambios?");
    } else {
      await accionGuardar();
    }
  };

  // Confirmación activar/desactivar
  const toggleActivo = () => {
    setConfirmAction(() => () =>
      handleChange("activo", !formData.activo)
    );
    setConfirmMessage(
      formData.activo
        ? "¿Seguro que desea desactivar este empleado? Esto negará el acceso al sistema."
        : "¿Seguro que desea activar este empleado? Esto permitirá acceso al sistema."
    );
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

        {/* FORMULARIO */}
        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 text-primary">

          {/* DATOS PERSONALES */}
          <section>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Datos Personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* NOMBRE */}
              <div>
                <label className="text-sm">Nombre *</label>
                <input
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.nombre}
                  onChange={(e) =>
                    handleChange("nombre", e.target.value)
                  }
                />
                {errores.nombre && (
                  <p className="text-alert text-xs">{errores.nombre}</p>
                )}
              </div>

              {/* APELLIDO */}
              <div>
                <label className="text-sm">Apellido *</label>
                <input
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.apellido}
                  onChange={(e) =>
                    handleChange("apellido", e.target.value)
                  }
                />
                {errores.apellido && (
                  <p className="text-alert text-xs">{errores.apellido}</p>
                )}
              </div>

              {/* DNI */}
              <div>
                <label className="text-sm">DNI *</label>
                <input
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.dni}
                  onChange={(e) =>
                    handleChange("dni", e.target.value)
                  }
                />
                {errores.dni && (
                  <p className="text-alert text-xs">{errores.dni}</p>
                )}
              </div>

              {/* Telefono */}
              <div>
                <label className="text-sm">Teléfono *</label>
                <input
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.telefono}
                  onChange={(e) =>
                    handleChange("telefono", e.target.value)
                  }
                />
                {errores.telefono && (
                  <p className="text-alert text-xs">
                    {errores.telefono}
                  </p>
                )}
              </div>

              {/* Direccion */}
              <div className="md:col-span-2">
                <label className="text-sm">Dirección *</label>
                <input
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.direccion}
                  onChange={(e) =>
                    handleChange("direccion", e.target.value)
                  }
                />
                {errores.direccion && (
                  <p className="text-alert text-xs">
                    {errores.direccion}
                  </p>
                )}
              </div>

              {/* Fecha nac */}
              <div>
                <label className="text-sm">Fecha nacimiento *</label>
                <input
                  type="date"
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.fechaNac}
                  onChange={(e) =>
                    handleChange("fechaNac", e.target.value)
                  }
                />
                {errores.fechaNac && (
                  <p className="text-alert text-xs">
                    {errores.fechaNac}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* DATOS EMPLEADO */}
          <section>
            <h3 className="text-lg font-semibold mb-4">
              Datos del Empleado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Puesto */}
              <div>
                <label className="text-sm">Puesto *</label>
                <select
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.puesto}
                  onChange={(e) =>
                    handleChange("puesto", e.target.value)
                  }
                >
                  {puestos.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salario */}
              <div>
                <label className="text-sm">Salario *</label>
                <input
                  type="number"
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.salario}
                  onChange={(e) =>
                    handleChange("salario", e.target.value)
                  }
                />
                {errores.salario && (
                  <p className="text-alert text-xs">{errores.salario}</p>
                )}
              </div>

              {/* Fecha ingreso */}
              <div>
                <label className="text-sm">Fecha ingreso *</label>
                <input
                  type="date"
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.fechaIngreso}
                  onChange={(e) =>
                    handleChange("fechaIngreso", e.target.value)
                  }
                />
                {errores.fechaIngreso && (
                  <p className="text-alert text-xs">
                    {errores.fechaIngreso}
                  </p>
                )}
              </div>

              {/* Check activo */}
              {empleadoSeleccionado && (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={toggleActivo}
                  />
                  <span className="text-sm">Empleado activo</span>
                </div>
              )}
            </div>
          </section>

          {/* CREAR USUARIO */}
          {!empleadoSeleccionado && (
            <section>
              <h3 className="text-lg font-semibold mb-4">
                Datos de usuario
              </h3>

              {/* Correo */}
              <div>
                <label className="text-sm">Correo *</label>
                <input
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.correo}
                  onChange={(e) =>
                    handleChange("correo", e.target.value)
                  }
                />
                {errores.correo && (
                  <p className="text-alert text-xs">{errores.correo}</p>
                )}
              </div>

              {/* Password */}
              <div className="mt-4">
                <label className="text-sm">Contraseña *</label>
                <input
                  type="password"
                  className="w-full border border-primary/20 rounded-lg px-3 py-2 mt-1"
                  value={formData.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                />
                {errores.password && (
                  <p className="text-alert text-xs">{errores.password}</p>
                )}
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
            onClick={trySave}
            className="btn-primary bg-success text-light hover:bg-success/90"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* CONFIRMACIÓN */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <ConfirmDialog
            message={confirmMessage}
            onConfirm={() => {
              confirmAction();
              setConfirmAction(null);
            }}
            onCancel={() => setConfirmAction(null)}
          />
        </div>
      )}

      {/* NOTIFICACIÓN */}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification("")}
        />
      )}
    </div>
  );
}

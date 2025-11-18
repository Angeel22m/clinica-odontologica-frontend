// src/components/EditarPacienteModal.tsx
import React, { useEffect, useState } from "react";
import type {
  PacienteRecepcionista,
  PacienteModificarPayload,
} from "../services/modificarInfoService";
import Modal from "./modal"; // Asegúrate que la ruta sea correcta

interface EditarPacienteModalProps {
  open: boolean;
  paciente: PacienteRecepcionista | null;
  onClose: () => void;
  onSave: (data: PacienteModificarPayload) => void | Promise<void>;
}

const EditarPacienteModal: React.FC<EditarPacienteModalProps> = ({
  open,
  paciente,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<PacienteModificarPayload>({
    // Estos campos se inicializarán en useEffect
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    // Se incluye 'password' porque es modificable
    password: "", 
  });

  useEffect(() => {
    if (open && paciente) {
      // Inicializar el formulario con los datos del paciente.
      setForm({
        dni: paciente.dni ?? "",
        telefono: paciente.telefono ?? "",
        direccion: paciente.direccion ?? "",
        fechaNac: paciente.fechaNac ? paciente.fechaNac.slice(0, 10) : "",
        password: "", // La contraseña siempre debe inicializarse vacía por seguridad.
      });
    }
  }, [open, paciente]);

  if (!open || !paciente) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Si la contraseña está vacía, no la enviamos al servicio.
    const payload: PacienteModificarPayload = form.password
      ? form
      : { ...form, password: undefined }; 
      
    await onSave(payload);
  };

  return (
    // Se elimina el Fragment innecesario y se usa directamente Modal.
    // El div anidado 'flex justify-center items-center bg-white max-w-lg' es redundante 
    // porque el componente Modal ya lo maneja.
    <Modal open={open} onClose={onClose} title="Editar Paciente">
      {/* Aplicamos estilos de scroll al form si es necesario. 
        Si el componente Modal ya maneja el scroll en el children, solo necesitamos el 'space-y-3'.
        Si quieres que el formulario ocupe un ancho específico, usa w-full max-w-xl.
      */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-3"> 
        {/* CORREO Y CONTRASEÑA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo
          </label>
          <input
            type="email"
            value={paciente.correo}
            disabled
            className="mt-1 w-full p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña (Dejar vacío para no cambiar)
          </label>
          <input
            type="password"
            name="password"
            value={form.password || ""}
            onChange={handleChange}
            placeholder="********"
            className="mt-1 w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* NOMBRE Y APELLIDO (DESHABILITADOS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={paciente.nombre || ""}
              disabled
              className="mt-1 w-full p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={paciente.apellido || ""}
              disabled
              className="mt-1 w-full p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* DNI Y TELÉFONO (EDITABLES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DNI
            </label>
            <input
              type="text"
              name="dni"
              value={form.dni || ""}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono || ""}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DIRECCIÓN (EDITABLE) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={form.direccion || ""}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* FECHA DE NACIMIENTO (EDITABLE) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            name="fechaNac"
            value={form.fechaNac || ""}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg btn-primary border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 btn-accent rounded-lg bg-accent text-white hover:bg-info transition duration-150"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarPacienteModal;
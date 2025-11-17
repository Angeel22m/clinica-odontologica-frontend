// src/components/EditarPacienteModal.tsx
import React, { useEffect, useState } from "react";
import type {
  PacienteRecepcionista,
  PacienteModificarPayload,
} from "../services/modificarInfoService";

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
    // nombre: "",
    // apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
  });

  useEffect(() => {
    if (open && paciente) {
      setForm({
        // nombre: paciente.nombre ?? "",
        // apellido: paciente.apellido ?? "",
        dni: paciente.dni ?? "",
        telefono: paciente.telefono ?? "",
        direccion: paciente.direccion ?? "",
        fechaNac: paciente.fechaNac ? paciente.fechaNac.slice(0, 10) : "",
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
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Editar información del paciente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password || ""}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                // value={form.nombre || ""}
                disabled
                value={paciente.nombre || ""}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg"
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
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
          </div>

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
                className="mt-1 w-full p-2 border rounded-lg"
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
                className="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion || ""}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="fechaNac"
              value={form.fechaNac || ""}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-info"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPacienteModal;

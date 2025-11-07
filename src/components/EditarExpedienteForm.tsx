import React, { useState } from "react";
import { updateExpediente } from "../services/api";
import type { UpdateExpedienteDto } from "../types/expediente";
import Modal from "./modal";

interface EditExpedienteFormProps {
  expedienteId: number;
  initialData?: UpdateExpedienteDto;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditExpedienteForm: React.FC<EditExpedienteFormProps> = ({
  expedienteId,
  initialData,
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateExpedienteDto>({
    alergias: initialData?.alergias || "",
    enfermedades: initialData?.enfermedades || "",
    medicamentos: initialData?.medicamentos || "",
    observaciones: initialData?.observaciones || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateExpediente(expedienteId, formData);
      setMessage("Expediente actualizado correctamente ");
      onSuccess?.();
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar el expediente ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar expediente">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Alergias</span>
          <textarea
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            className="border rounded-md p-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Enfermedades</span>
          <textarea
            name="enfermedades"
            value={formData.enfermedades}
            onChange={handleChange}
            className="border rounded-md p-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Medicamentos</span>
          <textarea
            name="medicamentos"
            value={formData.medicamentos}
            onChange={handleChange}
            className="border rounded-md p-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">Observaciones</span>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="border rounded-md p-2"
          />
        </label>

        <div className="flex justify-end gap-3 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.includes("Error") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </Modal>
  );
};

export default EditExpedienteForm;

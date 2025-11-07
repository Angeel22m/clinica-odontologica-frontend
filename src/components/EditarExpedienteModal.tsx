import React from "react";
import { X } from "lucide-react";
import EditExpedienteForm from "./EditarExpedienteForm";
import type { UpdateExpedienteDto } from "../types/expediente";

interface EditarExpedienteModalProps {
  expedienteId: number;
  onClose: () => void;
  initialValues?: UpdateExpedienteDto;
}

const EditarExpedienteModal: React.FC<EditarExpedienteModalProps> = ({
  expedienteId,
  onClose,
  initialValues,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Formulario de edición */}
        <EditExpedienteForm
          expedienteId={expedienteId}
          initialData={initialValues}
          onSuccess={onClose} // Cierra modal al guardar
        />
      </div>
    </div>
  );
};

export default EditarExpedienteModal;

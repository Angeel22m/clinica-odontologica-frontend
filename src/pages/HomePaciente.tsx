import { useState } from "react";
import ModalAgendarCita from "../components/ModalAgendarCita";

export default function HomePaciente() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary mt-4 mb-6">
        Bienvenido, [Nombre del Paciente]
      </h1>

      {/* Contenido principal */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">Tus citas</h2>
        {/* Aquí podrías listar las próximas citas o historial */}
        
        <button onClick={() => setShowModal(true)}>
          + Agendar nueva cita
        </button>
      </div>

      {/* Renderiza el modal solo si está activo */}
      {showModal && (
        <ModalAgendarCita onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

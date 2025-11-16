import React, { useState } from "react";
import Modal from "./modal";
import { addDetalleConsulta } from "../services/expedientesService"; // función para POST al backend


interface NuevoDetalleFormProps {
  expedienteId: number;
  doctorId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // callback al guardar
}

const NuevoDetalleForm: React.FC<NuevoDetalleFormProps> = ({ expedienteId, doctorId, open, onClose, onSuccess }) => {
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [planTratamiento, setPlanTratamiento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const nuevoDetalle = await addDetalleConsulta({
      expedienteId,
      doctorId,
      fecha: new Date(fecha).toISOString(),
      motivo,
      diagnostico,
      tratamiento,
      planTratamiento,
    });

    console.log("Detalle creado:", nuevoDetalle); // tiene id y fechas

    onSuccess(); // recargar lista de consultas
    onClose(); // cerrar modal
    setLoading(false);
  } catch (err: any) {
    console.error(err);
    setError("Error al guardar el detalle");
    setLoading(false);
  }
};


  return (
    <Modal open={open} onClose={onClose} title="Nuevo Detalle de Consulta">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Motivo</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
          <input
            type="text"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
          <input
            type="text"
            value={tratamiento}
            onChange={(e) => setTratamiento(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Plan de Tratamiento</label>
          <input
            type="text"
            value={planTratamiento}
            onChange={(e) => setPlanTratamiento(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NuevoDetalleForm;

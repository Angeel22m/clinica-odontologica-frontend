import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPacienteById } from "../../services/pacientesService";
import type { Paciente } from "../../types/Paciente";

const PacienteDetallePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const p = await getPacienteById(+id);
      setPaciente(p);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando...
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p>No se encontró el paciente solicitado.</p>
        <button
          onClick={() => navigate("/pacientes")}
          className="mt-4 px-4 py-2 rounded-lg bg-primary text-white"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-light text-gray-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-light border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">
            Detalle del Paciente
          </h1>
          <button
            onClick={() => navigate("/pacientes")}
            className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-6">

          {/* Datos del paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="Nombre" value={paciente.nombre} />
            <Info label="Apellido" value={paciente.apellido} />
            <Info label="DNI" value={paciente.dni} />
            <Info label="Teléfono" value={paciente.telefono || "-"} />
            <Info label="Correo" value={paciente.correo || "-"} />
            <Info label="Dirección" value={paciente.direccion || "-"} />
            <Info label="Fecha de Nacimiento" value={paciente.fechaNac || "-"} />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <button
              onClick={() => navigate(`/pacientes/${paciente.id}/editar`)}
              className="px-4 py-2 rounded-lg border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition"
            >
              Editar
            </button>

            {/* Citas deshabilitadas temporalmente */}
            {/* <button ...>Ver Citas</button> */}
            {/* <button ...>Crear Cita</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value}</p>
  </div>
);

export default PacienteDetallePage;

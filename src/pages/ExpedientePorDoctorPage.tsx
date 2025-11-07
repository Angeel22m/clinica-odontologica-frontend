import React, { useEffect, useState } from "react";
import { ExpedientesList } from "../components/ExpedienteList";
import { ExpedienteDetalle } from "../components/ExpedienteDetails";
import { ArrowLeftCircle } from "lucide-react";
import { fetchExpedientesByDoctor } from "../services/api";
import type { Expediente } from "../types/expediente";
import LogoutButton from "../components/LogoutButton";

interface Props {
  doctorId: number;
}

type ExpedienteConNombres = Expediente & {
  nombrePaciente: string;
  doctorNombre: string;
};

const ExpedientesPagePorDoctor: React.FC<Props> = ({ doctorId }) => {
  const [expedientes, setExpedientes] = useState<ExpedienteConNombres[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExpedientes = async () => {
      try {
        setLoading(true);
        const data = await fetchExpedientesByDoctor(doctorId);

        const mapped: ExpedienteConNombres[] = data.map((exp) => ({
          ...exp,
          nombrePaciente: `${exp.paciente.nombre} ${exp.paciente.apellido}`,
          doctorNombre: `${exp.doctor.persona.nombre} ${exp.doctor.persona.apellido}`,
        }));

        setExpedientes(mapped);
      } catch (err: unknown) {
        console.error(err);
        setError("No se pudieron cargar los expedientes.");
      } finally {
        setLoading(false);
      }
    };

    loadExpedientes();
  }, [doctorId]);

  const expedienteSeleccionado = expedientes.find((e) => e.id === selectedId);

  const handleLogout = () => {
    console.log("Logout"); // Reemplazar por lógica real
  };

  if (loading) return <div className="p-6 text-center">Cargando expedientes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (expedientes.length === 0) return <div className="p-6 text-center">No hay expedientes disponibles.</div>;

  return (
    <div className="min-h-screen bg-light p-6 relative">
      <LogoutButton onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto bg-light rounded-xl shadow-2xl p-6">
        {!expedienteSeleccionado ? (
          <>
            <h1 className="text-4xl font-bold text-primary mb-6">Gestión de Expedientes</h1>
            <ExpedientesList expedientes={expedientes} onSelect={setSelectedId} />
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 mb-6 text-accent hover:text-info transition"
            >
              <ArrowLeftCircle className="w-6 h-6" />
              <span className="font-medium">Volver a lista</span>
            </button>

            <ExpedienteDetalle expedienteId={expedienteSeleccionado.id} onBack={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpedientesPagePorDoctor;

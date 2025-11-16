// components/ListaExpedientes.tsx
import React, { useEffect, useState } from "react";
import { ExpedienteCard } from "./ExpedienteCards";
import { fetchExpedientesByDoctor } from "../services/expedientesService";
import type { Expediente } from "../types/expediente";

interface ExpedientesListProps {
  onSelect: (id: number) => void;
  doctorId: number;
}

export const ExpedientesList: React.FC<ExpedientesListProps> = ({ onSelect, doctorId }) => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpedientesByDoctor(doctorId)
      .then((data) => setExpedientes(data))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (loading) return <p>Cargando expedientes...</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {expedientes.map((exp) => (
        <ExpedienteCard key={exp.id} expediente={exp} onSelect={onSelect} />
      ))}
    </div>
  );
};

import React from "react";
import { ExpedienteCard } from "./ExpedienteCards";

interface ExpedientesListProps {
  expedientes: any[]; // Puedes cambiar a tu tipo Expediente[]
  onSelect: (id: number) => void;
}

export const ExpedientesList: React.FC<ExpedientesListProps> = ({ expedientes, onSelect }) => {
  if (!expedientes || expedientes.length === 0) return <p>No hay expedientes disponibles.</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {expedientes.map((exp) => (
        <ExpedienteCard key={exp.id} expediente={exp} onSelect={onSelect} />
      ))}
    </div>
  );
};

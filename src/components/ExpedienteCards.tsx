import React from "react";
import { User, FileText } from "lucide-react";
interface ExpedienteCardProps {
  expediente: any; // o tu tipo Expediente
  onSelect: (id: number) => void;
}

export const ExpedienteCard: React.FC<ExpedienteCardProps> = ({ expediente, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(expediente.id)}
      className="cursor-pointer bg-light border-l-4 border-accent rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-center mb-3">
        <User className="w-8 h-8 text-accent mr-3 bg-light rounded-full p-1" />
        <div>
          <h3 className="text-xl font-bold text-primary">{expediente.nombrePaciente}</h3>                 
        </div>
      </div>

      

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            expediente.activo ? "bg-success text-light" : "bg-primary text-light"
          }`}
        >
          {expediente.activo ? "Activo" : "Inactivo"}
        </span>
        <FileText className="w-5 h-5 text-accent" />
      </div>
    </div>
  );
};

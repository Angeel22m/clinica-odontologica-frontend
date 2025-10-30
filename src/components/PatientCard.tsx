import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Expediente } from '../types/expediente';

interface PatientCardProps {
  expediente: Expediente;
  isSelected: boolean;
  onClick: (pacienteId: number) => void; 
}

const PatientCard: React.FC<PatientCardProps> = ({ expediente, isSelected, onClick }) => {
  if (!expediente || !expediente.paciente) return null;

  return (
    <div
      className={`
        flex justify-between items-center p-4 mb-2 rounded-lg cursor-pointer transition-all duration-200
        shadow-sm hover:shadow-md
        ${isSelected
          ? 'bg-primary text-light shadow-lg scale-[1.01]'
          : 'bg-light text-primary hover:bg-accent hover:text-light'
        }
      `}
      onClick={() => onClick(expediente.pacienteId)}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Seleccionar expediente ${expediente.id} del paciente ${expediente.paciente.nombre} ${expediente.paciente.apellido}`}
    >
      <div>
        <p className="font-semibold text-lg">{expediente.paciente.nombre} {expediente.paciente.apellido}</p>
        <p className={`text-sm ${isSelected ? 'text-light/80' : 'text-primary/70'}`}>
          Expediente N° {expediente.id} | Paciente N° {expediente.pacienteId}
        </p>
      </div>
      <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-light' : 'text-accent'}`} />
    </div>
  );
};

export default PatientCard;

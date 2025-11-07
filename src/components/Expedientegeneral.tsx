import React from 'react';
import { User, Heart, BriefcaseMedical, Pill, Stethoscope } from 'lucide-react';
import type { Expediente } from '../types/expediente';

interface ExpedienteGeneralPanelProps {
  expediente: Expediente | null;
}

const ExpedienteGeneralPanel: React.FC<ExpedienteGeneralPanelProps> = ({ expediente }) => {
  if (!expediente) {
    return (
      <div className="flex flex-1 items-center justify-center text-secondary text-lg">
        Selecciona un expediente para ver los detalles generales.
      </div>
    );
  }

  const { paciente, doctor } = expediente;

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-light rounded-r-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">Expediente General</h2>

      <div className="flex items-center mb-6">
        <User className="w-12 h-12 text-accent mr-4 p-2 bg-accent/10 rounded-full" />
        <div>
          <h3 className="text-xl font-semibold text-primary">
            {paciente?.nombre} {paciente?.apellido}
          </h3>
          <p className="text-secondary text-sm">
            ID del Paciente: {expediente.pacienteId} | Expediente #{expediente.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-primary">
        <div className="flex items-center">
          <Heart className="w-4 h-4 mr-2 text-secondary" />
          <span><strong>Alergias:</strong> {expediente.alergias || 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <BriefcaseMedical className="w-4 h-4 mr-2 text-accent" />
          <span><strong>Enfermedades:</strong> {expediente.enfermedades || 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <Pill className="w-4 h-4 mr-2 text-success" />
          <span><strong>Medicamentos:</strong> {expediente.medicamentos || 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <Stethoscope className="w-4 h-4 mr-2 text-primary" />
          <span><strong>Doctor:</strong> {doctor?.persona?.nombre} {doctor?.persona?.apellido}</span>
        </div>
      </div>

      <div className="mt-8 border-t border-secondary/20 pt-4">
        <p className="text-sm text-secondary">
          <strong>Última actualización:</strong>{' '}
          {new Date(expediente.updatedAt || expediente.createdAt).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

export default ExpedienteGeneralPanel;

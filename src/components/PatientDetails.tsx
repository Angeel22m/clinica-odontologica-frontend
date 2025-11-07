import React, { useState } from 'react';
import { User, Calendar, FileText, Stethoscope, BriefcaseMedical, Pill, Heart, ArrowUpDown } from 'lucide-react';
import type { Expediente, ClinicalRecord } from '../types/expediente';

interface PatientDetailsProps {
  history: ClinicalRecord[];
  expediente: Expediente;
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const PatientDetails: React.FC<PatientDetailsProps> = ({ history, expediente }) => {
  const [ascending, setAscending] = useState(false); // false = descendente por defecto


  // Ordenar el historial según la preferencia del usuario
  const sortedHistory = [...history].sort((a, b) =>
    ascending
      ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      : new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  


  const { paciente, doctor } = expediente;

  return (
    <div className="p-6 bg-light rounded-xl shadow-xl h-full overflow-y-auto pt-0">
      <div className="mb-6 border-b pb-4 sticky top-0 bg-light z-10">
        <div className="flex items-start">
          <User className="w-12 h-12 text-accent mr-4 p-2 bg-light rounded-full flex-shrink-0" />
          <div>
            <h2 className="text-3xl font-bold text-primary">{paciente.nombre} {paciente.apellido}</h2>
            <p className="text-md text-secondary">
              Expediente N°: {expediente.id} | Paciente ID: {expediente.pacienteId}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-primary">
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-2 text-secondary" />
            <span className="font-semibold">Alergias:</span> {expediente.alergias || 'N/A'}
          </div>
          <div className="flex items-center">
            <BriefcaseMedical className="w-4 h-4 mr-2 text-accent" />
            <span className="font-semibold">Enfermedades:</span> {expediente.enfermedades || 'N/A'}
          </div>
          <div className="flex items-center">
            <Pill className="w-4 h-4 mr-2 text-success" />
            <span className="font-semibold">Medicamentos:</span> {expediente.medicamentos || 'N/A'}
          </div>
          <div className="flex items-center">
            <Stethoscope className="w-4 h-4 mr-2 text-secondary" />
            <span className="font-semibold">Doctor:</span> {doctor.persona.nombre} {doctor.persona.apellido}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-primary">Historial de Consultas</h3>
        <button
          onClick={() => setAscending(!ascending)}
          className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
        >
          <ArrowUpDown className="w-4 h-4" />
          {ascending ? 'Más antiguas primero' : 'Más recientes primero'}
        </button>
      </div>

      {sortedHistory.length === 0 && (
        <div className="text-center p-8 bg-light rounded-lg text-secondary">
          <FileText className="w-8 h-8 mx-auto mb-2 text-secondary/50" />
          <p>Este paciente no tiene registros clínicos.</p>
        </div>
      )}
      
      {/* Mostrar el historial de consultas*/}
      <div className="space-y-6">
        {sortedHistory.map((record) => (
          <div
            key={record.id}
            className="p-5 border-l-4 border-accent bg-light shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start border-b pb-2 mb-3">
              <h4 className="text-xl font-bold text-accent flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-accent" />
                Consulta #{record.id}
              </h4>
              <p className="text-sm text-secondary flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(record.fecha)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-primary text-sm">
              <div className="space-y-1">
                <p><strong>Motivo:</strong> {record.motivo}</p>
                <p><strong>Diagnóstico:</strong> {record.diagnostico}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Tratamiento:</strong> {record.tratamiento}</p>
                <p className="font-medium text-success flex items-center">Plan: {record.planTratamiento}</p>
              </div>
            </div>

            <p className="mt-3 pt-3 border-t text-xs text-secondary">
              Registrado por el Doctor {record.doctor.persona.nombre} {record.doctor.persona.apellido} | Creado: {formatDate(record.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDetails;

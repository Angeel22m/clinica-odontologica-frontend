// Define las interfaces compartidas para toda la aplicación

// Interfaz para los datos de nombre/apellido de paciente o doctor
export interface PatientData {
  nombre: string;
  apellido: string;
}

// Interfaz que representa un Expediente Maestro (respuesta de GET /expediente)
export interface Expediente {
  id: number; // ID del Expediente
  pacienteId: number; // ID real del Paciente (usado para el historial)
  doctorId: number;
  alergias: string;
  enfermedades: string;
  medicamentos: string;
  observaciones: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  paciente: PatientData; // Datos del paciente anidados
  doctor: {
    persona: PatientData; // Datos del doctor
  }
}

// Interfaz que representa un Registro Clínico (respuesta de GET /expediente/historial/:pacienteId)
export interface ClinicalRecord {
  id: number;
  expedienteId: number; 
  fecha: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  planTratamiento: string;
  doctorId: number;
   doctor: {
      persona: {
        nombre: string,
        apellido: string
      }
    },
  createdAt: string;
  updatedAt: string;
}
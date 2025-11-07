// Define las interfaces compartidas para toda la aplicación

// Interfaz para los datos de nombre/apellido de paciente o doctor
export interface PatientData {
  nombre: string;
  apellido: string;
}

// Interfaz que representa un Archivo adjunto en un expediente
export interface Archivo {
  id: number;  
  url: string;
  nombre:string;
  type:string;
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
  };
  detalles?: ClinicalRecord[]; // Historial de consultas (opcional)
  archivos?: Archivo[]; // Archivos adjuntos (opcional)
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
  doctor?: {
    persona: PatientData // Datos del doctor
  };
  createdAt: string;
  updatedAt: string;
}
 
// Interfaz para el retorno exitoso de un upload de archivo
export interface UploadSuccessData {
  fileName: string;
  dbId: number;
  signedUrl: string;
  message: string;
}

// types/expediente.ts (o donde tengas tus tipos)
export interface UpdateExpedienteDto {
  alergias?: string;
  enfermedades?: string;
  medicamentos?: string;
  observaciones?: string;
}

export interface NewClinicalRecord {

  expedienteId: number;
  doctorId: number;
  fecha: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  planTratamiento: string;
}
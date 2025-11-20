

// Interfaz para los datos del Empleado (Doctor) anidado en la asociación
export interface DoctorPersonData {
  persona: PatientData; // Reutiliza PatientData para nombre/apellido
}

// Interfaz que representa un registro en la tabla ExpedienteDoctor
export interface ExpedienteDoctorAssociation {
  expedienteId: number;
  doctorId: number;
  fechaAsociacion: string;
  doctor: DoctorPersonData; // El objeto del Doctor anidado
}

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
  id: number; 
  pacienteId: number; 
  alergias: string;
  enfermedades: string;
  medicamentos: string;
  observaciones: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  paciente: PatientData; // Datos del paciente anidados
  detalles?: ClinicalRecord[]; 
  archivos?: Archivo[]; 

  doctoresAsociados: ExpedienteDoctorAssociation[]; 
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

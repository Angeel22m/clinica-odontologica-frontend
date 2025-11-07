// src/types/Paciente.ts

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  fechaNac?: string;
}

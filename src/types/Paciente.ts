// Tipo para la información de la persona

export type Persona = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion?: string;
  fechaNac: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  correo: string;
  password: string;
  rol: "CLIENTE";
  activo: boolean;
  personaId: number;
  createdAt: string;
  updatedAt: string;
};

// // Paciente combinado (persona + usuario)
export type Paciente = {
  persona: Persona;
  user: User;
};

// Tipo para crear paciente (sin id ni timestamps)
export type NuevoPaciente = {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion?: string;
  fechaNac: string;
  correo: string;
};

export interface pacientes {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  fechaNac: string;
  correo: string;
  createdAt: string;
  updatedAt: string;
}

// src/types/empleado.ts

export type EspecialidadBase = {
    id: number;
    nombre: string;
    descripcion?: string;
};


export type EspecialidadDoctor = {
    doctorId: number;
    especialidadId: number;
    fechaAsociacion: string;
    especialidad: EspecialidadBase; 
};

export type EmpleadoPersona = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  user: user
  fechaNac: string;
  createdAt: string;
  updatedAt: string;
};

export type user = {
  correo:string
}

export type EmpleadoResponse = {
  id: number;
  personaId: number;
  puesto: string;
  salario: number;
  correo:string;
  password:string
  fechaIngreso: string;
  activo: boolean;
  persona: EmpleadoPersona;
  especialidades: EspecialidadDoctor[];
};


export type CrearEmpleadoDTO = {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNac: string;
  correo: string;
  password: string;
  activo: boolean;
  usuarioActivo: boolean;
  puesto: string;
  salario: number;
  fechaIngreso: string;
  especialidadIds?: number[];
};



export type ActualizarEmpleadoDTO = Partial<CrearEmpleadoDTO>;

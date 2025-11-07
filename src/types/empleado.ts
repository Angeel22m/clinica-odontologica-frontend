// src/types/empleado.ts

export type EmpleadoPersona = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNac: string;
  createdAt: string;
  updatedAt: string;
};

export type EmpleadoResponse = {
  id: number;
  personaId: number;
  puesto: string;
  salario: number;
  fechaIngreso: string;
  activo: boolean;
  persona: EmpleadoPersona;
};

// ✅ Crear empleado (POST)
export type CrearEmpleadoDTO = {
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
};

// ✅ Editar empleado (PUT)
export type ActualizarEmpleadoDTO = Partial<CrearEmpleadoDTO>;

// src/types/empleado.ts
export interface Empleado {
  id: number;                               // ID único
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNac: string;                          // ISO string (YYYY-MM-DD)
  correo: string;
  rol: "administrador" | "doctor" | "recepcionista";
  puesto: string;
  salario: number;
  fechaIngreso: string;                      // ISO string (YYYY-MM-DD)
  activo: boolean;
}

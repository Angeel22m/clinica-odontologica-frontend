export type Rol = "doctor" | "recepcionista" | "administrador";

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;            // 13 dígitos, con o sin guiones en UI (se guarda limpio)
  telefono: string;       // 8 dígitos, se guarda normalizado
  direccion: string;
  fechaNac: string;       // YYYY-MM-DD
  correo: string;
  rol: Rol;
  puesto: string;
  salario: number;
  fechaIngreso: string;   // YYYY-MM-DD
  activo: boolean;
}

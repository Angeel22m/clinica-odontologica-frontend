export type Persona = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string | null;
  direccion: string | null;
  fechaNac: string | null; // ISO string
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

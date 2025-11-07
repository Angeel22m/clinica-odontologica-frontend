// Tipo base que usa el frontend (plano, sin anidación)
export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  fechaNac: string;   // YYYY-MM-DD
  correo?: string;
  userId?: number | null; // null si aún no tiene usuario
  createdAt: string;
  updatedAt: string;
}

// Tipo para crear paciente desde formulario
export type NuevoPaciente = {
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  fechaNac: string;
  correo: string;      // porque también genera usuario
};


// Cuando exista backend real:
// convertimos Paciente plano → estructura { persona, user }

const toBackendPayload = (p: NuevoPaciente) => ({
  persona: {
    nombre: p.nombre,
    apellido: p.apellido,
    dni: p.dni,
    telefono: p.telefono,
    direccion: p.direccion,
    fechaNac: p.fechaNac,
  },
  user: {
    correo: p.correo,
    password: "autoGenerada", // o backend la genera
    rol: "CLIENTE"
  }
});

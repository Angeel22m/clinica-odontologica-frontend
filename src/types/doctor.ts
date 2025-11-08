// src/types/doctor.ts
export interface DoctorBasic {
  id: number;               // id de Empleado
  personaId: number;        // referencia a Persona
  nombre: string;
  apellido: string;
  puesto: "DOCTOR";
  activo: boolean;
}

export function nombreDoctor(d: DoctorBasic) {
  return `${d.nombre} ${d.apellido}`;
}

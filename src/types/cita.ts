// src/types/cita.ts
export type EstadoCita = "PENDIENTE" | "COMPLETADA" | "CANCELADA";

export interface Cita {
  id: number;
  fecha: string;            // ISO
  estado: EstadoCita;
  pacienteId: number;
  doctorId: number;
  servicioId: number;
  motivo?: string | null;
  observaciones?: string | null;
  createdAt: string;        // ISO
  updatedAt: string;        // ISO
}

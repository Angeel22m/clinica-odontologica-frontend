// src/services/citasService.ts
// Mock + localStorage, backend real comentado al final.

import doctoresSeed from "../mock/doctores.json";
import serviciosSeed from "../mock/servicios.json";

/* Tipos locales (puedes moverlos a src/types si prefieres) */
export type EstadoCita = "PENDIENTE" | "COMPLETADA" | "CANCELADA";

export type Cita = {
  id: number;
  fecha: string;          // ISO
  estado: EstadoCita;     // PENDIENTE por defecto
  pacienteId: number;
  doctorId: number;
  servicioId: number;
  motivo?: string | null;
  observaciones?: string | null;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
};

export type DoctorItem = {
  id: number;
  personaId: number;
  nombre: string;
  apellido: string;
  puesto: "DOCTOR";
  activo: boolean;
};

export type ServicioClinicoItem = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  activo: boolean;
};

/* Storage keys */
const LS_KEY_CITAS = "citas_mock_v1";

/* Seeds iniciales (pocas citas de ejemplo) */
const initialCitas: Cita[] = [
  // Pasadas/completadas (historial)
  {
    id: 1,
    fecha: "2025-09-15T08:00:00.000Z",
    estado: "COMPLETADA",
    pacienteId: 1,
    doctorId: 1,
    servicioId: 5,
    motivo: "Revisión general",
    observaciones: "Todo en orden",
    createdAt: "2025-09-10T12:00:00.000Z",
    updatedAt: "2025-09-15T09:00:00.000Z"
  },
  {
    id: 2,
    fecha: "2025-10-12T10:00:00.000Z",
    estado: "CANCELADA",
    pacienteId: 3,
    doctorId: 2,
    servicioId: 2,
    motivo: "Dolor de muela",
    observaciones: "Paciente canceló por enfermedad",
    createdAt: "2025-10-01T12:00:00.000Z",
    updatedAt: "2025-10-10T12:00:00.000Z"
  },
  // Pendientes (futuras)
  {
    id: 3,
    fecha: "2025-11-10T14:00:00.000Z",
    estado: "PENDIENTE",
    pacienteId: 1,
    doctorId: 3,
    servicioId: 3,
    motivo: "Estético",
    observaciones: null,
    createdAt: "2025-10-30T12:00:00.000Z",
    updatedAt: "2025-10-30T12:00:00.000Z"
  },
  {
    id: 4,
    fecha: "2025-11-12T09:30:00.000Z",
    estado: "PENDIENTE",
    pacienteId: 2,
    doctorId: 1,
    servicioId: 1,
    motivo: "Control",
    observaciones: null,
    createdAt: "2025-10-31T12:00:00.000Z",
    updatedAt: "2025-10-31T12:00:00.000Z"
  }
];

/* Utilidades */
function nowISO() {
  return new Date().toISOString();
}

function loadCitas(): Cita[] {
  const raw = localStorage.getItem(LS_KEY_CITAS);
  if (raw) return JSON.parse(raw) as Cita[];
  localStorage.setItem(LS_KEY_CITAS, JSON.stringify(initialCitas));
  return initialCitas.slice();
}

function saveCitas(citas: Cita[]) {
  localStorage.setItem(LS_KEY_CITAS, JSON.stringify(citas));
}

function nextId(citas: Cita[]): number {
  return citas.length ? Math.max(...citas.map((c) => c.id)) + 1 : 1;
}

/* Exponer catálogos (mock) */
export async function getDoctores(): Promise<DoctorItem[]> {
  // BACKEND REAL:
  // const res = await fetch("/api/doctores");
  // if (!res.ok) throw new Error("Error al cargar doctores");
  // return res.json();
  return doctoresSeed as DoctorItem[];
}

export async function getServicios(): Promise<ServicioClinicoItem[]> {
  // BACKEND REAL:
  // const res = await fetch("/api/servicios");
  // if (!res.ok) throw new Error("Error al cargar servicios");
  // return res.json();
  return serviciosSeed as ServicioClinicoItem[];
}

/* Consultas */
export async function getCitasByPaciente(pacienteId: number): Promise<Cita[]> {
  const data = loadCitas();
  const list = data.filter((c) => c.pacienteId === pacienteId);
  // Orden: más recientes primero
  return list.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export async function getCitaById(id: number): Promise<Cita | null> {
  const data = loadCitas();
  return data.find((c) => c.id === id) || null;
}

/* Validación de solapamiento de agenda (mismo doctor + misma fecha/hora) */
function isDoctorBusy(citas: Cita[], doctorId: number, fechaISO: string, excludeId?: number): boolean {
  const slot = new Date(fechaISO).toISOString();
  return citas.some((c) => c.doctorId === doctorId && c.fecha === slot && c.id !== excludeId && c.estado !== "CANCELADA");
}

/* Mutaciones */
export async function crearCita(input: {
  pacienteId: number;
  doctorId: number;
  servicioId: number;
  fecha: string; // ISO o compatible con new Date(...)
  motivo?: string | null;
  observaciones?: string | null;
}): Promise<Cita> {
  const citas = loadCitas();

  const fechaISO = new Date(input.fecha).toISOString();

  // Validación: doctor no puede tener dos citas en el mismo slot
  if (isDoctorBusy(citas, input.doctorId, fechaISO)) {
    throw new Error("El doctor ya tiene una cita en ese horario");
  }

  const nueva: Cita = {
    id: nextId(citas),
    fecha: fechaISO,
    estado: "PENDIENTE",
    pacienteId: input.pacienteId,
    doctorId: input.doctorId,
    servicioId: input.servicioId,
    motivo: input.motivo || null,
    observaciones: input.observaciones || null,
    createdAt: nowISO(),
    updatedAt: nowISO()
  };

  citas.push(nueva);
  saveCitas(citas);
  return nueva;

  /* BACKEND REAL (ejemplo):
  const res = await fetch("/api/citas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pacienteId: input.pacienteId,
      doctorId: input.doctorId,
      servicioId: input.servicioId,
      fecha: fechaISO,
      motivo: input.motivo,
      observaciones: input.observaciones
    }),
  });
  if (!res.ok) throw new Error("Error al crear la cita");
  return res.json();
  */
}

export async function actualizarCita(id: number, patch: Partial<Omit<Cita, "id" | "createdAt">>): Promise<Cita> {
  const citas = loadCitas();
  const idx = citas.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cita no encontrada");

  // Si cambia doctor/fecha, volvemos a validar solapamiento
  const newDoctor = patch.doctorId ?? citas[idx].doctorId;
  const newFecha = patch.fecha ? new Date(patch.fecha).toISOString() : citas[idx].fecha;

  if (isDoctorBusy(citas, newDoctor, newFecha, id)) {
    throw new Error("El doctor ya tiene una cita en ese horario");
  }

  const updated: Cita = {
    ...citas[idx],
    ...patch,
    fecha: newFecha,
    updatedAt: nowISO()
  };
  citas[idx] = updated;
  saveCitas(citas);
  return updated;

  /* BACKEND REAL (ejemplo):
  const res = await fetch(`/api/citas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Error al actualizar la cita");
  return res.json();
  */
}

export async function cancelarCita(id: number): Promise<Cita> {
  const citas = loadCitas();
  const idx = citas.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cita no encontrada");

  const updated: Cita = { ...citas[idx], estado: "CANCELADA", updatedAt: nowISO() };
  citas[idx] = updated;
  saveCitas(citas);
  return updated;

  /* BACKEND REAL (ejemplo):
  const res = await fetch(`/api/citas/${id}/cancelar`, { method: "POST" });
  if (!res.ok) throw new Error("Error al cancelar la cita");
  return res.json();
  */
}

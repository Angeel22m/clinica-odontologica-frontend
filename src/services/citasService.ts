// src/services/citasService.ts
// Mock + localStorage; backend real comentado al final.

import doctoresSeed from "../mock/doctores.json";
import serviciosSeed from "../mock/servicios.json";
import type { Cita, EstadoCita } from "../types/cita";
import type { DoctorBasic } from "../types/doctor";
import type { ServicioClinico } from "../types/servicioClinico";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};
const LS_KEY_CITAS = "clinica_citas_v1";

function nowISO() {
  return new Date().toISOString();
}

function loadCitas(): Cita[] {
  const raw = localStorage.getItem(LS_KEY_CITAS);
  if (raw) return JSON.parse(raw) as Cita[];

  const seeded = generateSeedCitas(); // 60 aprox como tu seed
  localStorage.setItem(LS_KEY_CITAS, JSON.stringify(seeded));
  return seeded;
}

function saveCitas(citas: Cita[]) {
  localStorage.setItem(LS_KEY_CITAS, JSON.stringify(citas));
}

function nextId(citas: Cita[]): number {
  return citas.length ? Math.max(...citas.map((c) => c.id)) + 1 : 1;
}

export async function getDoctoresActivos(): Promise<DoctorBasic[]> {
  const list = doctoresSeed as DoctorBasic[];
  return list.filter((d) => d.activo);
}

export async function getServiciosActivos(): Promise<ServicioClinico[]> {
  const list = serviciosSeed as ServicioClinico[];
  return list.filter((s) => s.activo);
}

export async function getCitasByPaciente(pacienteId: number): Promise<Cita[]> {
  const data = loadCitas();
  const list = data.filter((c) => c.pacienteId === pacienteId);
  return list.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export async function getCitaById(id: number): Promise<Cita | null> {
  const data = loadCitas();
  return data.find((c) => c.id === id) || null;
}

// Validación: mismo doctor en misma fecha/hora (exacta) y no cancelada
function isDoctorBusy(citas: Cita[], doctorId: number, fechaISO: string, excludeId?: number) {
  const slot = new Date(fechaISO).toISOString();
  return citas.some(
    (c) =>
      c.doctorId === doctorId &&
      c.fecha === slot &&
      c.id !== excludeId &&
      c.estado !== "CANCELADA"
  );
}

// No permitir fechas pasadas
function isPast(fechaISO: string) {
  return new Date(fechaISO).getTime() < Date.now();
}

export async function crearCita(input: {
  pacienteId: number;
  doctorId: number;
  servicioId: number;
  fecha: string; // ISO o compatible
  motivo?: string | null;
  observaciones?: string | null;
}): Promise<Cita> {
  const citas = loadCitas();
  const fechaISO = new Date(input.fecha).toISOString();

  if (isPast(fechaISO)) {
    throw new Error("La fecha/hora no puede ser en el pasado");
  }
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
    motivo: input.motivo ?? null,
    observaciones: input.observaciones ?? null,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  citas.push(nueva);
  saveCitas(citas);
  return nueva;

  /*
  // BACKEND REAL
  const res = await fetch("/api/citas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, fecha: fechaISO }),
  });
  if (!res.ok) throw new Error("Error al crear cita");
  return res.json();
  */
}

export async function actualizarCita(
  id: number,
  patch: Partial<Omit<Cita, "id" | "createdAt">>
): Promise<Cita> {
  const citas = loadCitas();
  const idx = citas.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cita no encontrada");

  const newDoctor = patch.doctorId ?? citas[idx].doctorId;
  const newFecha = patch.fecha ? new Date(patch.fecha).toISOString() : citas[idx].fecha;

  if (isPast(newFecha)) {
    throw new Error("La fecha/hora no puede ser en el pasado");
  }
  if (isDoctorBusy(citas, newDoctor, newFecha, id)) {
    throw new Error("El doctor ya tiene una cita en ese horario");
  }

  const updated: Cita = {
    ...citas[idx],
    ...patch,
    fecha: newFecha,
    updatedAt: nowISO(),
  };
  citas[idx] = updated;
  saveCitas(citas);
  return updated;

  /*
  // BACKEND REAL
  const res = await fetch(`/api/citas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Error al actualizar cita");
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

  /*
  // BACKEND REAL
  const res = await fetch(`/api/citas/${id}/cancelar`, { method: "POST" });
  if (!res.ok) throw new Error("Error al cancelar cita");
  return res.json();
  */
}

// Genera ~60 citas como la seed: COMPLETADA (sep), CANCELADA (oct en algunos), PENDIENTE (nov)
function generateSeedCitas(): Cita[] {
  const doctores = (doctoresSeed as DoctorBasic[]).filter((d) => d.activo);
  const servicios = serviciosSeed as ServicioClinico[];
  const doctorIds = doctores.map((d) => d.id);
  const numServicios = servicios.length;
  const BASE_YEAR = 2025;
  const NUM_CLIENTES = 20;

  const citas: Cita[] = [];
  let id = 1;

  const getDoctorId = (i: number) => doctorIds[i % doctorIds.length];

  for (let i = 1; i <= NUM_CLIENTES; i++) {
    const doctor = getDoctorId(i);
    const servicio = ((i % numServicios) + 1);

    const diaCompletada = String(5 + i).padStart(2, "0");
    const diaCancelada = String(10 + i).padStart(2, "0");
    const diaPendiente = String(5 + i).padStart(2, "0");

    // COMPLETADA (historial)
    citas.push({
      id: id++,
      fecha: new Date(`${BASE_YEAR}-09-${diaCompletada}T08:00:00Z`).toISOString(),
      estado: "COMPLETADA",
      pacienteId: i,
      doctorId: doctor,
      servicioId: servicio,
      motivo: "Control",
      observaciones: "Finalizada",
      createdAt: new Date(`${BASE_YEAR}-09-01T12:00:00Z`).toISOString(),
      updatedAt: new Date(`${BASE_YEAR}-09-${diaCompletada}T10:00:00Z`).toISOString(),
    });

    // CANCELADA (para algunos)
    if (i % 3 === 0) {
      citas.push({
        id: id++,
        fecha: new Date(`${BASE_YEAR}-10-${diaCancelada}T10:00:00Z`).toISOString(),
        estado: "CANCELADA",
        pacienteId: i,
        doctorId: getDoctorId(i + 1),
        servicioId: ((i + 1) % numServicios) + 1,
        motivo: "Dolor",
        observaciones: "Paciente canceló",
        createdAt: new Date(`${BASE_YEAR}-10-01T12:00:00Z`).toISOString(),
        updatedAt: new Date(`${BASE_YEAR}-10-${diaCancelada}T09:00:00Z`).toISOString(),
      });
    }

    // PENDIENTE (futura)
    citas.push({
      id: id++,
      fecha: new Date(`${BASE_YEAR}-11-${diaPendiente}T14:00:00Z`).toISOString(),
      estado: "PENDIENTE",
      pacienteId: i,
      doctorId: doctor,
      servicioId: ((i + 2) % numServicios) + 1,
      motivo: "Tratamiento",
      observaciones: null,
      createdAt: new Date(`${BASE_YEAR}-10-25T12:00:00Z`).toISOString(),
      updatedAt: new Date(`${BASE_YEAR}-10-25T12:00:00Z`).toISOString(),
    });
  }

  return citas;
}

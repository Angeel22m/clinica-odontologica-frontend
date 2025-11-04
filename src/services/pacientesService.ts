import pacientesSeed from "../mock/pacientes.json";
import type { Paciente, NuevoPaciente } from "../types/Paciente";

const STORAGE_KEY = "pacientes_mock";

function load(): Paciente[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as Paciente[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientesSeed));
  return pacientesSeed as Paciente[];
}

function save(data: Paciente[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function nextId(data: Paciente[]) {
  return data.length ? Math.max(...data.map((p) => p.persona.id)) + 1 : 1;
}

export async function getPacientes(): Promise<Paciente[]> {
  return load();
}

export async function getPacienteById(id: number): Promise<Paciente | null> {
  const data = load();
  return data.find((p) => p.persona.id === id) || null;
}

export async function buscarPacientes(query: string): Promise<Paciente[]> {
  const s = query.toLowerCase();
  const data = load();
  return data.filter((p) => {
    const nombre = p.persona.nombre.toLowerCase();
    const apellido = p.persona.apellido.toLowerCase();
    const correo = p.user?.correo?.toLowerCase() || "";
    const dni = p.persona.dni;
    return (
      nombre.includes(s) ||
      apellido.includes(s) ||
      correo.includes(s) ||
      dni.includes(query)
    );
  });
}

/**
 * Crea paciente + usuario con password generada (apellido + año fechaNac).
 * Retorna el paciente creado para poder mostrar credenciales en UI.
 */
export async function crearPaciente(data: NuevoPaciente): Promise<Paciente> {
  const all = load();

  // Duplicados básicos
  const dniNorm = data.dni.replace(/\D/g, "");
  const telNorm = data.telefono.replace(/\D/g, "");
  const correoNorm = data.correo.trim().toLowerCase();

  if (all.some((p) => p.persona.dni === dniNorm)) {
    throw new Error("Ya existe un paciente con ese DNI");
  }
  if (all.some((p) => (p.user?.correo || "").toLowerCase() === correoNorm)) {
    throw new Error("Ya existe un usuario con ese correo");
  }

  const id = nextId(all);
  const now = new Date().toISOString();
  const year = new Date(data.fechaNac).getFullYear();
  const pass = `${data.apellido.toLowerCase()}${year}`;

  const nuevo: Paciente = {
    persona: {
      id,
      nombre: data.nombre,
      apellido: data.apellido,
      dni: dniNorm,
      telefono: telNorm,
      direccion: data.direccion || "",
      fechaNac: data.fechaNac,
      createdAt: now,
      updatedAt: now,
    },
    user: {
      id,
      correo: correoNorm,
      password: pass,
      rol: "CLIENTE",
      activo: true,
      personaId: id,
      createdAt: now,
      updatedAt: now,
    },
  };

  all.push(nuevo);
  save(all);
  return nuevo;

  /* BACKEND REAL (ejemplo):
  const res = await fetch("/api/pacientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear paciente");
  return res.json();
  */
}

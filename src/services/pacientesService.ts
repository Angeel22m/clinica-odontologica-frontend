// src/services/pacientesService.ts
import seed from "../mock/pacientes.json";
import type { Paciente } from "../types/Paciente";
import type { Persona } from "../types/Persona";
import type { User, Rol } from "../types/User";

// Usa tus validaciones existentes.
// Si tu ruta difiere, ajusta este import.
import {
  validarCorreo,
  validarDNI,
  validarTelefono,
  normalizarDNI,
  normalizarTelefono,
} from "../utils/validaciones";

// Clave para persistencia en localStorage
const LS_KEY = "pacientes_mock_v1";

// Carga inicial: intenta desde localStorage, si no existe usa el JSON seed.
function loadState(): Paciente[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Paciente[];
  } catch {}
  // Copia profunda del seed para evitar mutaciones del import
  return (seed as Paciente[]).map((p) => ({
    persona: { ...p.persona },
    user: p.user ? { ...p.user } : null,
  }));
}

// Guarda estado en localStorage
function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

// Estado en memoria
let state: Paciente[] = loadState();

// Obtiene siguiente id incremental a partir de una colección con campo id
function nextId(collection: { id: number }[]): number {
  return collection.length ? Math.max(...collection.map((x) => x.id)) + 1 : 1;
}

// Genera contraseña: apellido + año nacimiento (minúsculas, sin tildes)
function generarPassword(apellido: string, fechaNac: string | null): string {
  const base = (apellido || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  const year = fechaNac ? new Date(fechaNac).getFullYear() : new Date().getFullYear();
  return `${base}${year}`;
}

// Devuelve copia defensiva
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/* ============================
   Consultas de solo lectura
   ============================ */

// Lista completa (mock). Backend real: usar fetch a /api/pacientes
export async function getPacientes(): Promise<Paciente[]> {
  // BACKEND REAL:
  // const res = await fetch("http://localhost:3000/api/pacientes");
  // if (!res.ok) throw new Error("Error al obtener pacientes");
  // return res.json();
  return Promise.resolve(clone(state));
}

// Por id de Persona
export async function getPacienteById(id: number): Promise<Paciente | null> {
  const found = state.find((p) => p.persona.id === id) || null;
  return Promise.resolve(found ? clone(found) : null);
}

// Por DNI (normalizado)
export async function getPacienteByDNI(dni: string): Promise<Paciente | null> {
  const d = normalizarDNI(dni);
  const found = state.find((p) => normalizarDNI(p.persona.dni) === d) || null;
  return Promise.resolve(found ? clone(found) : null);
}

// Validaciones de duplicados
export async function existeDNI(dni: string): Promise<boolean> {
  const d = normalizarDNI(dni);
  return Promise.resolve(state.some((p) => normalizarDNI(p.persona.dni) === d));
}

export async function existeCorreo(correo: string): Promise<boolean> {
  const c = (correo || "").trim().toLowerCase();
  return Promise.resolve(
    state.some((p) => (p.user?.correo || "").toLowerCase() === c)
  );
}

/* ============================
   Mutaciones (mock + persist)
   ============================ */

// Crea Persona (paso 1). Requiere datos mínimos y válidos.
// Nota: en tu modelo Prisma, el correo está en User, no en Persona.
// Desde el formulario, pedimos el correo y lo usamos en el paso 2.
export async function crearPersona(input: {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNac: string; // ISO date (yyyy-mm-dd)
}): Promise<Persona> {
  // Campos obligatorios
  if (
    !input.nombre?.trim() ||
    !input.apellido?.trim() ||
    !input.dni?.trim() ||
    !input.telefono?.trim() ||
    !input.direccion?.trim() ||
    !input.fechaNac?.trim()
  ) {
    throw new Error("Todos los campos son obligatorios");
  }

  // Formatos
  if (!validarDNI(input.dni)) throw new Error("DNI inválido");
  if (!validarTelefono(input.telefono)) throw new Error("Teléfono inválido");

  // Duplicados
  if (await existeDNI(input.dni)) throw new Error("Ya existe un paciente con ese DNI");

  const now = new Date().toISOString();
  const persona: Persona = {
    id: nextId(state.map((p) => p.persona)),
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    dni: normalizarDNI(input.dni),
    telefono: normalizarTelefono(input.telefono),
    direccion: input.direccion.trim(),
    fechaNac: input.fechaNac,
    createdAt: now,
    updatedAt: now,
  };

  // Inserta con user = null de forma temporal
  state.push({ persona, user: null });
  saveState();

  // BACKEND REAL (ejemplo):
  // const res = await fetch("http://localhost:3000/api/personas", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     nombre: persona.nombre,
  //     apellido: persona.apellido,
  //     dni: persona.dni,
  //     telefono: persona.telefono,
  //     direccion: persona.direccion,
  //     fechaNac: persona.fechaNac,
  //   }),
  // });
  // if (!res.ok) throw new Error("Error creando persona");
  // const personaDb = await res.json();
  // return personaDb;

  return clone(persona);
}

// Crea User (paso 2). Requiere persona existente y correo único.
export async function crearUsuarioParaPersona(params: {
  personaId: number;
  correo: string;
  rol?: Rol; // por defecto "CLIENTE"
}): Promise<{ user: User; passwordGenerada: string }> {
  const persona = state.find((p) => p.persona.id === params.personaId);
  if (!persona) throw new Error("Persona no encontrada");

  const correo = (params.correo || "").trim().toLowerCase();
  if (!validarCorreo(correo)) throw new Error("Correo inválido");
  if (await existeCorreo(correo)) throw new Error("Ya existe un usuario con ese correo");

  const password = generarPassword(persona.persona.apellido, persona.persona.fechaNac);
  const now = new Date().toISOString();

  const user: User = {
    id: nextId(
      state
        .filter((p) => p.user)
        .map((p) => p.user!) as User[]
    ),
    correo,
    rol: (params.rol || "CLIENTE") as Rol,
    activo: true,
    personaId: persona.persona.id,
    createdAt: now,
    updatedAt: now,
  };

  // Vincula en el estado
  persona.user = user;
  saveState();

  // BACKEND REAL (ejemplo):
  // const res = await fetch("http://localhost:3000/api/users", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     correo: user.correo,
  //     password, // enviar solo al crear
  //     rol: user.rol,
  //     personaId: user.personaId,
  //   }),
  // });
  // if (!res.ok) throw new Error("Error creando usuario");
  // const userDb = await res.json();
  // return { user: userDb, passwordGenerada: "(no la retornará el backend)" };

  return { user: clone(user), passwordGenerada: password };
}

// Flujo completo: Crear Persona y luego User (automático)
export async function crearPacienteConUsuario(input: {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNac: string;
  correo: string;
}): Promise<{ persona: Persona; user: User; passwordGenerada: string }> {
  // 1) Persona
  const persona = await crearPersona({
    nombre: input.nombre,
    apellido: input.apellido,
    dni: input.dni,
    telefono: input.telefono,
    direccion: input.direccion,
    fechaNac: input.fechaNac,
  });

  // 2) User
  const { user, passwordGenerada } = await crearUsuarioParaPersona({
    personaId: persona.id,
    correo: input.correo,
    rol: "CLIENTE",
  });

  return { persona, user, passwordGenerada };
}

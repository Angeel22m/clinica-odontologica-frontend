// src/services/pacientesService.ts
import raw from "../mock/pacientes.json";
import type { Persona } from "../types/Persona";
import type { User, Rol } from "../types/User";
import type { Paciente } from "../types/Paciente";
import { normalizarDNI, normalizarTelefono, validarCorreo, validarDNI, validarTelefono } from "../utils/validaciones";

// Clone del mock para poder mutarlo en runtime
let data: Paciente[] = (raw as Paciente[]).map(p => ({
  persona: { ...p.persona },
  user: p.user ? { ...p.user } : null
}));

// Genera nuevo ID incremental tipo Prisma (para persona y user)
function nextId(collection: { id: number }[]): number {
  return collection.length ? Math.max(...collection.map(x => x.id)) + 1 : 1;
}

// Genera password: apellido + año de nacimiento (minúsculas, sin acentos simples)
function generarPassword(apellido: string, fechaNac: string | null): string {
  const base = (apellido || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const year = fechaNac ? new Date(fechaNac).getFullYear() : new Date().getFullYear();
  return `${base}${year}`;
}

// Busca por DNI
export async function getPacienteByDNI(dni: string): Promise<Paciente | null> {
  const limpio = normalizarDNI(dni);
  const found = data.find(p => normalizarDNI(p.persona.dni) === limpio) || null;
  return Promise.resolve(found);
}

// Busca por id Persona
export async function getPacienteById(id: number): Promise<Paciente | null> {
  return Promise.resolve(data.find(p => p.persona.id === id) || null);
}

// Obtiene todos
export async function getPacientes(): Promise<Paciente[]> {
  // BACKEND REAL:
  // const res = await fetch("/api/pacientes");
  // return res.json();
  return Promise.resolve(data);
}

// Validaciones de duplicado
export async function existeDNI(dni: string): Promise<boolean> {
  const limpio = normalizarDNI(dni);
  return Promise.resolve(data.some(p => normalizarDNI(p.persona.dni) === limpio));
}
export async function existeCorreo(correo: string): Promise<boolean> {
  const c = correo.trim().toLowerCase();
  return Promise.resolve(data.some(p => p.user?.correo.toLowerCase() === c));
}

// Crea Persona (paso 1)
export async function crearPersona(input: Omit<Persona, "id" | "createdAt" | "updatedAt">): Promise<Persona> {
  // Validaciones obligatorias
  if (!input.nombre?.trim() || !input.apellido?.trim() || !input.dni?.trim() || !input.correo?.trim()) {
    throw new Error("Todos los campos son obligatorios");
  }
  if (!validarDNI(input.dni)) throw new Error("DNI inválido");
  if (!validarCorreo(input.correo)) throw new Error("Correo inválido");
  if (!validarTelefono(input.telefono || "")) throw new Error("Teléfono inválido");

  // Duplicados
  if (await existeDNI(input.dni)) throw new Error("Ya existe un paciente con ese DNI");
  if (await existeCorreo(input.correo)) throw new Error("Ya existe un paciente con ese correo");

  const now = new Date().toISOString();
  const persona: Persona = {
    id: nextId(data.map(d => d.persona)),
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    dni: normalizarDNI(input.dni),
    telefono: normalizarTelefono(input.telefono || ""),
    direccion: input.direccion || "",
    fechaNac: input.fechaNac || null,
    createdAt: now,
    updatedAt: now
  };

  // Inserta en colección con user = null temporalmente
  data.push({ persona, user: null });

  // BACKEND REAL:
  // const res = await fetch("/api/personas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  // const persona = await res.json();

  return Promise.resolve(persona);
}

// Crea User para Persona (paso 2)
export async function crearUsuarioParaPersona(persona: Persona): Promise<User> {
  const password = generarPassword(persona.apellido, persona.fechaNac);
  const now = new Date().toISOString();

  const user: User = {
    id: nextId(data.filter(p => p.user).map(p => p.user!) as User[]),
    correo: (persona as any).correo || "", // Nota: si decides mover correo a Persona, ajústalo; por ahora usamos el correo que viene desde el formulario.
    rol: "CLIENTE" as Rol,
    activo: true,
    personaId: persona.id,
    createdAt: now,
    updatedAt: now
  };

  // Validación de correo antes de asignar
  if (!user.correo || !validarCorreo(user.correo)) {
    throw new Error("Correo inválido para usuario");
  }
  if (await existeCorreo(user.correo)) {
    throw new Error("Ya existe un usuario con ese correo");
  }

  // Vincula el user al registro de data
  const idx = data.findIndex(p => p.persona.id === persona.id);
  if (idx >= 0) {
    data[idx].user = user;
  }

  // En backend real enviarías password al crear:
  // await fetch("/api/users", { method: "POST", body: JSON.stringify({ correo: user.correo, password, rol: "CLIENTE", personaId: persona.id }) });

  // IMPORTANTE: por seguridad, no devolvemos password aquí. Muestra solo una vez en UI si lo generas en frontend.
  return Promise.resolve(user);
}

// Flujo combinado: crear Persona y luego User
export async function crearPacienteConUsuario(input: {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNac: string;
  correo: string;
}): Promise<{ persona: Persona; user: User; passwordGenerada: string }> {
  // 1) Crear persona
  const persona = await crearPersona({
    nombre: input.nombre,
    apellido: input.apellido,
    dni: input.dni,
    telefono: input.telefono,
    direccion: input.direccion,
    fechaNac: input.fechaNac,
    // Nota: incluimos correo en input general; si no está en Persona, lo usamos al crear el User.
    // Para mock, lo leeremos como (input as any).correo cuando creemos el user.
  } as any);

  // 2) Crear user
  const password = generarPassword(input.apellido, input.fechaNac || null);

  // Para mock, inyectamos correo desde el formulario
  (persona as any).correo = input.correo;

  const user = await crearUsuarioParaPersona(persona);

  return { persona, user, passwordGenerada: password };
}

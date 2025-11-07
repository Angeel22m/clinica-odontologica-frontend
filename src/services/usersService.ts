// src/services/userService.ts
// Mock + localStorage. Backend real está comentado más abajo.

import type { User } from "../types/User";
import type { Paciente } from "../types/Paciente";

const LS_KEY_USERS = "clinica_users_v1";

function nowISO() {
  return new Date().toISOString();
}

function loadUsers(): User[] {
  const raw = localStorage.getItem(LS_KEY_USERS);
  if (raw) return JSON.parse(raw) as User[];

  const seeded: User[] = []; // no seed inicial, se van creando con pacientes
  localStorage.setItem(LS_KEY_USERS, JSON.stringify(seeded));
  return seeded;
}

function saveUsers(list: User[]) {
  localStorage.setItem(LS_KEY_USERS, JSON.stringify(list));
}

function nextId(list: User[]): number {
  return list.length ? Math.max(...list.map((u) => u.id)) + 1 : 1;
}

export async function getUserByPersonaId(personaId: number): Promise<User | null> {
  const users = loadUsers();
  return users.find((u) => u.personaId === personaId) || null;
}

export async function getUserByCorreo(correo: string): Promise<User | null> {
  const users = loadUsers();
  return users.find((u) => u.correo.toLowerCase() === correo.toLowerCase()) || null;
}

export async function crearUserParaPaciente(paciente: Paciente): Promise<User> {
  const users = loadUsers();

  const exists = users.find(
    (u) => u.correo.toLowerCase() === paciente.correo.toLowerCase()
  );
  if (exists) {
    throw new Error("Ya existe un usuario con ese correo");
  }

  const año = new Date(paciente.fechaNac).getFullYear();
  const password = `${paciente.apellido.toLowerCase()}${año}`;

  const nuevo: User = {
    id: nextId(users),
    correo: paciente.correo,
    password,
    rol: "CLIENTE",
    activo: true,
    personaId: paciente.id,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  users.push(nuevo);
  saveUsers(users);
  return nuevo;

  /*
  // BACKEND REAL (usuario + password autogenerada)
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      correo: paciente.correo,
      password,
      rol: "CLIENTE",
      personaId: paciente.id
    }),
  });
  if (!res.ok) throw new Error("Error al crear el usuario en backend");
  return res.json();
  */
}

export async function toggleUserActivo(id: number): Promise<User> {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("Usuario no encontrado");

  users[idx].activo = !users[idx].activo;
  users[idx].updatedAt = nowISO();
  saveUsers(users);
  return users[idx];

  /*
  // BACKEND REAL
  const res = await fetch(`/api/users/${id}/toggle`, { method: "PATCH" });
  if (!res.ok) throw new Error("Error al cambiar estado de usuario");
  return res.json();
  */
}

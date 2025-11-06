import type { Paciente, NuevoPaciente } from "../types/Paciente";
import { crearUserParaPaciente, getUserByCorreo } from "./usersService";

const STORAGE_KEY = "pacientes_mock_v1";

// Carga/guarda en localStorage
function loadPacientes(): Paciente[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Paciente[]) : [];
}
function savePacientes(list: Paciente[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// IDs autoincrement
function nextId(list: Paciente[]): number {
  return list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
}

// Helpers
export async function getPacientes(): Promise<Paciente[]> {
  return loadPacientes();
}
export async function getPacienteById(id: number): Promise<Paciente | null> {
  const list = loadPacientes();
  return list.find((p) => p.id === id) || null;
}
export async function buscarPacientePorDNI(dni: string): Promise<Paciente | null> {
  const list = loadPacientes();
  return list.find((p) => p.dni === dni) || null;
}

// Crea paciente + usuario automáticamente (password = apellido + año)
export async function crearPaciente(data: NuevoPaciente): Promise<{ paciente: Paciente; user: { correo: string; password: string } }> {
  const list = loadPacientes();

  // Validaciones de duplicado en mock
  if (list.some((p) => p.dni === data.dni)) {
    throw new Error("DNI ya registrado");
  }
  if (list.some((p) => p.correo.toLowerCase() === data.correo.toLowerCase())) {
    throw new Error("Correo ya registrado");
  }
  // Teléfono opcional, pero si viene se valida duplicado
  if (data.telefono) {
    if (list.some((p) => (p.telefono || "") === data.telefono)) {
      throw new Error("Teléfono ya registrado");
    }
  }

  // También validar duplicado de correo contra users mock
  const userCorreo = await getUserByCorreo(data.correo);
  if (userCorreo) {
    throw new Error("Correo ya registrado");
  }

  const now = new Date().toISOString();
  const paciente: Paciente = {
    id: nextId(list),
    nombre: data.nombre,
    apellido: data.apellido,
    dni: data.dni,
    telefono: data.telefono || "",
    direccion: data.direccion || "",
    fechaNac: data.fechaNac,
    correo: data.correo,
    userId: null, // se setea luego de crear user
    createdAt: now,
    updatedAt: now,
  };

  // Persistimos paciente primero (simulación transacción)
  list.push(paciente);
  savePacientes(list);

  // Crear usuario automáticamente (usa regla apellido + año)
  try {
    const createdUser = await crearUserParaPaciente(paciente);
    // Actualizamos userId en Paciente
    const list2 = loadPacientes();
    const idx = list2.findIndex((p) => p.id === paciente.id);
    if (idx !== -1) {
      list2[idx].userId = createdUser.id;
      list2[idx].updatedAt = new Date().toISOString();
      savePacientes(list2);
    }

    return {
      paciente: { ...paciente, userId: createdUser.id },
      user: { correo: createdUser.correo, password: createdUser.password },
    };
  } catch (err) {
    // Si falla la creación del usuario, revertir paciente
    const rollback = loadPacientes().filter((p) => p.id !== paciente.id);
    savePacientes(rollback);
    throw err;
  }

  /*
  // BACKEND REAL
  const res = await fetch("/api/pacientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en backend al crear paciente");
  return res.json(); // Debe devolver { paciente, user }
  */
}

export async function actualizarPaciente(id: number, cambios: Partial<Paciente>): Promise<boolean> {
  const list = loadPacientes();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  // Si cambia correo/dni/telefono, validar duplicados
  if (cambios.dni && list.some((p) => p.id !== id && p.dni === cambios.dni)) {
    throw new Error("DNI ya registrado");
  }
  if (cambios.correo && list.some((p) => p.id !== id && p.correo.toLowerCase() === cambios.correo.toLowerCase())) {
    throw new Error("Correo ya registrado");
  }
  if (typeof cambios.telefono === "string" && cambios.telefono.length > 0) {
    if (list.some((p) => p.id !== id && (p.telefono || "") === cambios.telefono)) {
      throw new Error("Teléfono ya registrado");
    }
  }

  list[idx] = { ...list[idx], ...cambios, updatedAt: new Date().toISOString() };
  savePacientes(list);
  return true;

  /*
  const res = await fetch(`/api/pacientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
  return res.ok;
  */
}

export async function eliminarPaciente(id: number): Promise<boolean> {
  const list = loadPacientes();
  const after = list.filter((p) => p.id !== id);
  savePacientes(after);
  return true;

  /*
  const res = await fetch(`/api/pacientes/${id}`, { method: "DELETE" });
  return res.ok;
  */
}

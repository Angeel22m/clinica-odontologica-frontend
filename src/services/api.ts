import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

//Funciones para gestionar usuarios
// Obtener lista de usuarios
export async function getUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`);
  return await res.json();
}

// Obtener usuario por ID
export async function createUsuario(data: any) {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Actualizar usuario
export async function updateUsuario(id: number, data: any) {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Desactivar usuario
export async function desactivarUsuario(id: number) {
  const res = await fetch(`${API_URL}/usuarios/${id}/desactivar`, {
    method: "PATCH",
  });
  return await res.json();
}
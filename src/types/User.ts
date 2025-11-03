export type Rol = "ADMIN" | "DOCTOR" | "RECEPCIONISTA" | "CLIENTE";

export type User = {
  id: number;
  correo: string;
  rol: Rol;
  activo: boolean;
  personaId: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

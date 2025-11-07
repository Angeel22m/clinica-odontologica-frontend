export type Rol = "ADMIN" | "DOCTOR" | "RECEPCIONISTA" | "CLIENTE";

// export type User = {
//   id: number;
//   correo: string;
//   rol: Rol;
//   activo: boolean;
//   personaId: number;
//   createdAt: string; // ISO
//   updatedAt: string; // ISO
// };

export interface User {
  id: number;
  correo: string;
  password: string;
  rol: "ADMIN" | "DOCTOR" | "RECEPCIONISTA" | "CLIENTE";
  activo: boolean;
  personaId: number;
  createdAt: string;
  updatedAt: string;
}


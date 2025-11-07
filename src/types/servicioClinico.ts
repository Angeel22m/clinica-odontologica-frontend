// src/types/servicioClinico.ts
export interface ServicioClinico {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  activo: boolean;
}

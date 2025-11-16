
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNac: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cita {
  id: number;
  fecha: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  hora: string;
  pacienteId: number;
  doctorId: number;
  servicioId: number;
  createdAt: string;
  updatedAt: string;
  servicio: Servicio;
  paciente: Paciente;
}
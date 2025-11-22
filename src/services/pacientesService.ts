// src/services/pacientesService.ts
const BASE_URL = "http://localhost:3000";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};
export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  fechaNac?: string;
}

/**
 * Obtiene la lista de pacientes desde /expediente
 * y la transforma al formato que usa el frontend.
 */
export async function getPacientes(): Promise<Paciente[]> {
  try {
    const res = await fetch(`${BASE_URL}/expediente`);
    const json = await res.json();

    // Manejar dos posibles formatos:
    const expedientes = Array.isArray(json) ? json : json.data;

    if (!Array.isArray(expedientes)) return [];

    // Transformamos expedientes a pacientes
    return expedientes
      .filter((exp) => exp.paciente) // Nos aseguramos que exista paciente
      .map((exp) => {
        const p = exp.paciente;
        return {
          id: p.id ?? exp.pacienteId ?? 0,
          nombre: p.nombre,
          apellido: p.apellido,
          dni: p.dni,
          telefono: p.telefono || "",
          correo: p.correo || "",
          direccion: p.direccion || "",
          fechaNac: p.fechaNac || "",
        };
      });
  } catch (err) {
    console.error("Error cargando pacientes:", err);
    return [];
  }
}


export async function getPacienteById(id: number): Promise<Paciente | null> {
  const pacientes = await getPacientes();
  return pacientes.find((p) => p.id === id) || null;
}

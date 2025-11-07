// src/services/expedienteService.ts
const BASE_URL = "http://localhost:3000";

/**
 * Crea un expediente vacío para un paciente recién registrado.
 * No lanza error, retorna false si falla.
 */
export async function createExpediente(pacienteId: number): Promise<boolean> {
  try {
    const body = {
      pacienteId,
      doctorId: null,
      alergias: "",
      enfermedades: "",
      medicamentos: "",
      observaciones: "",
    };

    const res = await fetch(`${BASE_URL}/expediente`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => null);

    // Si el backend devuelve { data: {...} }
    const result = json?.data ?? json;

    // Si result tiene id, asumimos que se creó bien
    return !!result?.id;
  } catch (err) {
    console.error("Error creando expediente:", err);
    return false;
  }
}

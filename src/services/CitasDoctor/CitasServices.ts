import api from "../../utils/api";
import { AxiosError } from "axios";
import type { Cita } from "../../types/TypesCitas/CitasPorDoctor";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const fetchExpedientes = async (id: number): Promise<Cita> => {
  try {
    const response = await api.get<Cita>(`/citas/doctor/${id}`, headers);

    // Si el backend no retorna data válida
    if (!response.data) {
      throw new Error("No se recibieron citas desde el servidor.");
    }

    return response.data;

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Error al cargar expedientes:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error desconocido al cargar expedientes", error);
    }
    throw error;
  }
};

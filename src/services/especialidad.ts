// src/services/especialidad.ts
import axios from "axios";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const fetchEspecialidades = async () => {
  const response = await axios.get("http://localhost:3000/especialidad", headers);
  return Array.isArray(response.data)
    ? response.data
    : response.data.data ?? [];
};

export const createEspecialidad = async (especialidad: {
  nombre: string;
  descripcion: string;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/especialidad",
      especialidad,
      headers
    );

    return {
      message: response.data.message,
      code: response.data.code,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Error al crear",
      code: error.response?.data?.code || -1,
    };
  }
};

export const updateEspecialidad = async (
  id: number,
  especialidad: { nombre: string; descripcion: string }
) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/especialidad/${id}`,
      especialidad,
      headers
    );

    return {
      message: response.data.message,
      code: response.data.code,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Error al actualizar",
      code: error.response?.data?.code || -1,
    };
  }
};

export const deleteEspecialidad = async (id: number) => {
  return await axios.delete(
    `http://localhost:3000/especialidad/${id}`,
    headers
  );
};

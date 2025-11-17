// src/services/modificarInfoService.ts
import { api } from "./axios";
import { AxiosError } from "axios";

// Datos que el recepcionista puede modificar
export interface PacienteModificarPayload {
  dni?: string;
  telefono?: string;
  direccion?: string;
  fechaNac?: string; // YYYY-MM-DD desde el input, convertimos antes de enviar
  password?: string;
}

// Datos que llegan desde el backend
export interface PacienteRecepcionista {
  id: number;
  correo: string;
  password: string;
  nombre: string | null;
  apellido: string | null;
  dni: string | null;
  telefono: string | null;
  direccion: string | null;
  fechaNac: string | null;
}

class ModificarInfoService {
  // Buscar paciente por correo
  async buscarPorCorreo(correo: string): Promise<PacienteRecepcionista> {
    try {
      const res = await api.get(`/Modificar/${correo}`);

      const user = res.data?.data;

      if (!user || !user.persona) {
        throw new Error("Respuesta inválida del servidor");
      }

      const persona = user.persona;

      return {
        id: persona.id,
        correo: user.correo,
        password: user.contrasena,    // nombre correcto en tu backend
        nombre: persona.nombre ?? null,
        apellido: persona.apellido ?? null,
        dni: persona.dni ?? null,
        telefono: persona.telefono ?? null,
        direccion: persona.direccion ?? null,
        fechaNac: persona.fechaNac ?? null, // llega como ISO
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          (error.response?.data as any)?.message ||
          "Error al buscar al paciente";
        throw { status, message };
      }

      throw {
        status: undefined,
        message: "Error desconocido al buscar al paciente",
      };
    }
  }

  // Completar o editar datos del paciente
  async completarDatosPorCorreo(
    correo: string,
    data: PacienteModificarPayload
  ): Promise<void> {
    try {
      // Convertir fecha YYYY-MM-DD → ISO antes de enviar
      const payload = {
        ...data,
        fechaNac: data.fechaNac
          ? new Date(data.fechaNac).toISOString()
          : null,
      };

      await api.put(`/Modificar/${correo}`, payload);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message =
          (error.response?.data as any)?.message ||
          "Error al actualizar datos del paciente";
        throw { status, message };
      }

      throw {
        status: undefined,
        message: "Error desconocido al actualizar datos del paciente",
      };
    }
  }
}

const modificarInfoService = new ModificarInfoService();
export default modificarInfoService;

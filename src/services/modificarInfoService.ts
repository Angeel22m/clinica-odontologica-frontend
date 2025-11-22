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
  /**
     * Función privada y modular: Maneja la lógica de la llamada y el formateo.
     * @param endpoint El endpoint completo para la búsqueda (e.g., `/Modificar/correo/test@mail.com`).
     */
    private async buscarGenerico(endpoint: string): Promise<PacienteRecepcionista> {
        try {
            // 1. Ejecutar la llamada a la API
            const res = await api.get(endpoint);
            const user = res.data?.data;

            if (!user || !user.persona) {
                throw new Error("Respuesta inválida del servidor");
            }

            const persona = user.persona;

            // 2. Formatear y retornar la respuesta (lógica de formateo centralizada)
            return {
                id: persona.id,
                correo: user.correo,
                password: user.contrasena,
                nombre: persona.nombre ?? null,
                apellido: persona.apellido ?? null,
                dni: persona.dni ?? null,
                telefono: persona.telefono ?? null,
                direccion: persona.direccion ?? null,
                fechaNac: persona.fechaNac ?? null,
            };

        } catch (error) {
            // 3. Manejo de Errores (lógica centralizada)
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

    // ----------------------------------------------------------------------
    // Métodos Públicos
    // ----------------------------------------------------------------------

   /**
     * Busca paciente por correo.
     */
    async buscarPorCorreo(correo: string): Promise<PacienteRecepcionista> {
        // Nuevo Endpoint: Usa 'buscar?tipo=correo&valor='
        const endpoint = `/Modificar/buscar?tipo=correo&valor=${correo}`;
        return this.buscarGenerico(endpoint);
    }
    
    /**
     *  Busca paciente por DNI.
     */
    async buscarPorDni(dni: string): Promise<PacienteRecepcionista> {
        // Nuevo Endpoint: Usa 'buscar?tipo=dni&valor='
        const endpoint = `/Modificar/buscar?tipo=dni&valor=${dni}`;
        return this.buscarGenerico(endpoint);
    }

    /**
     * Busca paciente por Teléfono.
     */
    async buscarPorTelefono(telefono: string): Promise<PacienteRecepcionista> {
        // Nuevo Endpoint: Usa 'buscar?tipo=telefono&valor='
        const endpoint = `/Modificar/buscar?tipo=telefono&valor=${telefono}`;
        return this.buscarGenerico(endpoint);
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

      await api.patch(`/Modificar/${correo}`, payload);
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

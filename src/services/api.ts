import type { Expediente, ClinicalRecord } from '../types/expediente';
import { api } from './axios';
import { AxiosError } from 'axios';

/**
 * Obtiene todos los expedientes
 */
export const fetchExpedientes = async (): Promise<Expediente[]> => {
  try {
    const { data } = await api.get<Expediente[]>('/expediente');
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error al cargar expedientes:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido al cargar expedientes', error);
    }
    throw error;
  }
};

/**
 * Obtiene el historial clínico de un paciente por su ID
 */
export const fetchPatientHistory = async (pacienteId: number): Promise<ClinicalRecord[]> => {
  try {
    const { data } = await api.get<ClinicalRecord[]>(`/expediente/historial/${pacienteId}`);
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(`Error al cargar historial para paciente ${pacienteId}:`, error.response?.data || error.message);
    } else {
      console.error(`Error desconocido al cargar historial para paciente ${pacienteId}`, error);
    }
    throw error;
  }
};


export const fetchExpedienteById = async (id: number): Promise<Expediente> => {
  try {
    const { data } = await api.get<Expediente>(`/expediente/${id}`);
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(`Error al cargar expediente con ID ${id}:`, error.response?.data || error.message);
    } else {
      console.error('Error desconocido al cargar expediente', error);
    }
    throw error;
  }
};


/**
 * Sube un archivo al servidor para un expediente específico.
 * @param file El objeto File a subir.
 * @param expedienteId El ID del expediente al que se adjuntará el archivo.
 * @param creadoPorId El ID del usuario creador.
 * @param onProgress Callback opcional para reportar el porcentaje de subida (0-100). 💡 NUEVO
 * @returns Los datos de respuesta del servidor (metadata del archivo subido).
 */
export const uploadFileToExpediente = async (
  file: File,
  expedienteId: number,
  creadoPorId: number,
  onProgress?: (percent: number) => void, // 💡 Nuevo parámetro para el progreso
): Promise<{ fileName: string; dbId: number; signedUrl: string; message: string }> => {
  try {
    // 1. Crear el objeto FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expedienteId', expedienteId.toString());
    formData.append('creadoPorId', creadoPorId.toString());

    // 2. Definir la URL de la petición POST
    const url = `/expediente/archivo/upload`;

    // 3. Realizar la petición POST con Axios
    const { data } = await api.post(url, formData, {
      // 💡 IMPLEMENTACIÓN DE onUploadProgress
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.lengthComputable) {
          // Calcula el porcentaje de subida
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          
          // Llama al callback si se proporcionó
          if (onProgress) {
            onProgress(percent); 
          }
        }
      },
    });

    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error al subir el archivo:', error.response?.data || error.message);
      // Relanza el error con un mensaje más claro para el componente
      throw new Error(error.response?.data?.message || 'Error desconocido al subir el archivo.');
    } else {
      console.error('Error desconocido en la subida', error);
      throw new Error('Error de red desconocido.');
    }
  }
};
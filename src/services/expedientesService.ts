import type { Expediente, ClinicalRecord,UpdateExpedienteDto,NewClinicalRecord } from '../types/expediente';
import { api } from './axios';
import { AxiosError } from 'axios';


const headers = {headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}}
/**
 * Obtiene todos los expedientes
 */
export const fetchExpedientes = async (): Promise<Expediente[]> => {
  try {
    const { data } = await api.get<Expediente[]>('/expediente',{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}});
    return data;
  } catch (error: unknown)  {
    if (error instanceof AxiosError) {
      console.error('Error al cargar expedientes:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido al cargar expedientes', error);
    }
    throw error;
  }
};

//obtener expedientes por id 
export const getExpedienteById = async (id: number): Promise<Expediente> => {
  if (!id) throw new Error("No se proporcionó un ID de expediente");
  const response = await api.get<Expediente>(`/expediente/${id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}});
  return response.data;
};

//obtener expedientes por id del paciente
export const getExpedienteByIdPaciente = async (id: number): Promise<Expediente> => {
  if (!id) throw new Error("No se proporcionó un ID de expediente");
  const response = await api.get<Expediente>(`/expediente/paciente/${id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}});
  return response.data;
};

export const addDetalleConsulta = async (data: NewClinicalRecord): Promise<ClinicalRecord> => {
  const response = await api.post(`/expediente/detalle/${data.expedienteId}`, data,headers);
  return response.data.data; // aquí accedemos a `data` dentro del response
};


/**
 * Obtiene el historial clínico de un paciente por su ID
 */
export const fetchPatientHistory = async (pacienteId: number): Promise<ClinicalRecord[]> => {
  try {
    const { data } = await api.get<ClinicalRecord[]>(`/expediente/historial/${pacienteId}`,headers);
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
    const { data } = await api.get<Expediente>(`/expediente/${id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}});
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

   const token = localStorage.getItem("token"); // o tu variable global

const { data } = await api.post(url, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data", // importante para FormData
  },
  onUploadProgress: (progressEvent: any) => {
    if (progressEvent.lengthComputable) {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percent);
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

export const fetchExpedientesByDoctor = async (doctorId: number): Promise<Expediente[]> => {
  try {
    const { data } = await api.get<Expediente[]>(`/expediente/doctor/${doctorId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}});
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(`Error al cargar historial de expedientes para el doctor ${doctorId}:`, error.response?.data || error.message);
    } else {
      console.error(`Error desconocido al cargar historial de expedientes para el doctor ${doctorId}`, error);
    }
    throw error;
  }
};

/**
 * Actualiza un expediente por ID
 */
export const updateExpediente = async (id: number, payload: UpdateExpedienteDto): Promise<Expediente> => {
  try {
    const { data } = await api.put<Expediente>(`/expediente/${id}`, payload,headers);
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(`Error al actualizar expediente ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Error desconocido al actualizar expediente ${id}`, error);
    }
    throw error;
  }
};
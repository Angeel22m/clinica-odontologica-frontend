import type { Expediente, ClinicalRecord } from '../types/expediente';
import { api } from './axios';
import { AxiosError } from 'axios';

/**
 * Obtiene todos los expedientes (Maestro)
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

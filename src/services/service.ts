import * as Service from '../types/Service';
import { api } from './axios';
import { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000/servicios';

// Obtener todos los servicios
export const fetchServices = async (): Promise<Service[]> => {
  const { data } = await api.get(API_URL);
  return data;
};

// Crear un nuevo servicio
export const createService = async (service: Service): Promise<Service> => {
  const { data } = await api.post(API_URL, service);
  return data;
};

// Actualizar un servicio
export const updateService = async (id: number, service: Service): Promise<Service> => {
  const { data } = await api.put(`${API_URL}/${id}`, {
  	nombre: service.nombre,
  	descripcion: service.descripcion,
  	precio: Math.floor(service.precio),
  	activo: service.activo,
  });
  return data;
};

// Eliminar un servicio
export const deleteService = async (id: number): Promise<void> => {
  return await api.delete(`${API_URL}/${id}`);
};

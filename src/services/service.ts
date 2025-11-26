import * as ServiceTypes from '../types/Service';
import api from '../utils/api';
import { AxiosError } from 'axios';

// ----------------------------------------------------
// Tipos Auxiliares (Ajustar según tu DTO de NestJS)
// ----------------------------------------------------

// Define el formato de datos que se enviará desde el formulario
interface ServiceFormData {
    nombre: string;
    descripcion: string;
    precio: number;
    activo: boolean;
    especialidadIds: number[]; // Array de IDs de especialidades
}

// ----------------------------------------------------

// Función para obtener los headers de autorización
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});


// ## Obtener todos los servicios
export const fetchServices = async (): Promise<ServiceTypes.Service[]> => {
    try {
        const { data } = await api.get('/servicios', getAuthHeaders());
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error fetching services:', error.response?.data || error.message);
        }
        throw new Error('Fallo al obtener la lista de servicios.');
    }
};

// ## Crear un nuevo servicio
// Recibe el formato de datos del formulario (ServiceFormData)
export const createService = async (serviceData: ServiceFormData): Promise<ServiceTypes.Service> => {
    try {
        const { data } = await api.post('/servicios', serviceData, getAuthHeaders());
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error creating service:', error.response?.data || error.message);
        }
        throw new Error('Fallo al crear el servicio.');
    }
};

// ## Actualizar un servicio
// Recibe el ID y el formato de datos del formulario (ServiceFormData)
export const updateService = async (id: number, serviceData: ServiceFormData): Promise<ServiceTypes.Service> => {
    try {
        // Aseguramos que el precio se envíe como entero y se incluyan los especialidadIds
        const payload = {
            ...serviceData,
            precio: Math.floor(serviceData.precio),
        };
        
        const { data } = await api.patch(`/servicios/${id}`, payload, getAuthHeaders());
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(`Error updating service ID ${id}:`, error.response?.data || error.message);
        }
        throw new Error(`Fallo al actualizar el servicio con ID ${id}.`);
    }
};

// ## Eliminar un servicio
export const deleteService = async (id: number): Promise<void> => {
    try {
        await api.delete(`/servicios/${id}`, getAuthHeaders());
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(`Error deleting service ID ${id}:`, error.response?.data || error.message);
        }
        throw new Error(`Fallo al eliminar el servicio con ID ${id}.`);
    }
};
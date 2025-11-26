// Define la estructura base de una especialidad (si solo necesitas el ID y nombre)
export interface Specialty {
    id: number;
    nombre: string;
}

// Define la estructura de la relación entre Servicio y Especialidad
export interface ServiceEspecialidad {
    // Si tienes un ID de la relación o alguna otra metadata, la pones aquí.
    // Lo más importante es cómo se accede al objeto especialidad:
    especialidad: Specialty;
    // Podría haber un campo 'servicioId', 'especialidadId', etc., dependiendo del ORM.
}

// Define la interfaz principal del servicio
export default interface Service {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    activo: boolean;
    // Aquí se corrige el array para que contenga objetos de tipo ServiceEspecialidad
    especialidades: ServiceEspecialidad[]; 
}
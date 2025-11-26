import  { useState, useEffect } from "react";
import ServiceTable from "../components/ServiceTable";
import ServiceForm from "../components/ServiceForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import { fetchServices, createService, updateService, deleteService } from "../services/service";
import * as Service from "../types/Service";
import { Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import expecialidadService from "../services/especialidad/especialidadService";

interface ServiceFormData {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    activo: boolean;
    especialidadIds: number[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceType.Service[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType.Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState("");

  const [allSpecialties, setAllSpecialties] = useState<{ id: number; nombre: string }[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);


  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data.sort((a, b) => a.id - b.id)); 
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        setNotification("Error al cargar los servicios");
      }
    };
    loadServices();
  }, []);

   useEffect(() => {
    const loadSpecialties = async () => {
      setLoadingSpecialties(true);
      try {
        const data = await expecialidadService.list();
        // Asumo formato [{ id, nombre, ... }]
        setAllSpecialties(data);
      } catch (err) {
        console.error("Error al cargar especialidades:", err);
        setNotification("Error al cargar especialidades");
      } finally {
        setLoadingSpecialties(false);
      }
    };

    loadSpecialties();
  }, []);

  //  3. Manejar Guardar (Creación o Edición) 
    // La función ahora espera ServiceFormData, el tipo que envía el ServiceForm
    const handleSave = async (serviceData: ServiceFormData) => {
        // Objeto base para enviar a la API, sin el ID
        const payloadToSend = {
            nombre: serviceData.nombre,
            descripcion: serviceData.descripcion,
            precio: Math.floor(serviceData.precio),
            activo: Boolean(serviceData.activo),
            especialidadIds: serviceData.especialidadIds,
        };

        try {
            if (serviceData.id) {
                // Actualizar
                await updateService(serviceData.id, payloadToSend);
                setNotification("Servicio actualizado correctamente");
            } else {
                // Crear
                await createService(payloadToSend);
                setNotification("Servicio agregado correctamente");
            }

            // Recargar la lista completa
            const updated = await fetchServices();
            setServices(updated.sort((a, b) => (a.id || 0) - (b.id || 0)));

        } catch (error) {
            console.error("Error al guardar servicio:", error);
            // Mostrar mensaje genérico de fallo de guardado
            setNotification(error.message || "Error al guardar el servicio"); 
        } finally {
            setShowForm(false);
            setSelectedService(null);
        }
    };

    //  4. Manejar Eliminación 
    const handleDelete = async (id: number) => {
        try {
            // El servicio de eliminación lanza un error en caso de fallo,
            // no necesitamos revisar data.code
            await deleteService(id);
            setNotification("Servicio eliminado correctamente");

            // Recargar la lista
            const updated = await fetchServices();
            setServices(updated.sort((a, b) => (a.id || 0) - (b.id || 0)));

        } catch (error) {
            console.error("Error al eliminar servicio:", error);
            // Mostrar mensaje genérico de fallo de eliminación
            setNotification(error.message || "Error al eliminar el servicio"); 
        } finally {
            setShowConfirm(false);
            setSelectedService(null);
        }
    };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="services-page bg-light p-6 min-h-screen">
       <button>
     <Link className="btn-primary w-32 flex items-center gap-1" to={"/dashboard"}>
        <FiChevronLeft />
        
        Regresar</Link>

        </button>
      <h1 className="text-3xl text-primary text-center mb-6 font-bold">Administrar Servicios</h1>

      <div className="flex justify-center mb-4">
        <button
          id="add-service-btn"
          className="btn-primary px-4 py-2 rounded hover:bg-accent mb-5"
          onClick={() => { setSelectedService(null); setShowForm(true); }}
        >
          Agregar Servicio
        </button>
      </div>

      <ServiceTable
        services={services}
        onEdit={service => { setSelectedService(service); setShowForm(true); }}
        onDelete={service => { setSelectedService(service); setShowConfirm(true); }}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ServiceForm
            service={selectedService}
            onClose={() => setShowForm(false)}
            onSave={handleSave}
            allSpecialties={allSpecialties}
          />
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ConfirmDialog
            message={`¿Está seguro de que desea eliminar ${selectedService?.nombre}?`}
            onConfirm={() => handleDelete(selectedService!.id!)}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}

      {notification && (
        <Notification message={notification} onClose={() => setNotification("")} />
      )}
    </div>
  );
}


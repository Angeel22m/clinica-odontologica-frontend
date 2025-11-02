import React, { useState, useEffect } from "react";
import ServiceTable from "../components/ServiceTable";
import ServiceForm from "../components/ServiceForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import { fetchServices, createService, updateService, deleteService } from "../services/service";
import * as Service from "../types/Service";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceType.Service[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType.Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notification, setNotification] = useState("");

  // Cargar servicios al montar
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data.sort((a, b) => a.id - b.id)); // Ordenar por id
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        setNotification("Error al cargar los servicios");
      }
    };
    loadServices();
  }, []);

  // Guardar o actualizar servicio
  const handleSave = async (service: Omit<ServiceType.Service, "id"> & Partial<Pick<ServiceType.Service, "id">>) => {
    try {
      if (service.id) {
        // Actualizar servicio
        await updateService(service.id, {
          nombre: service.nombre,
          descripcion: service.descripcion,
          precio: Math.floor(service.precio),
          activo: Boolean(service.activo),
        });
        setNotification("Servicio actualizado correctamente");
      } else {
        // Crear nuevo servicio
        await createService({
          nombre: service.nombre,
          descripcion: service.descripcion,
          precio: Math.floor(service.precio),
          activo: Boolean(service.activo),
        });
        setNotification("Servicio agregado correctamente");
      }

      // Refrescar lista desde backend y ordenar
      const updated = await fetchServices();
      setServices(updated.sort((a, b) => a.id - b.id));

    } catch (error) {
      console.error("Error al guardar servicio:", error);
      setNotification("Error al guardar el servicio");
    } finally {
      setShowForm(false);
      setSelectedService(null);
    }
  };

  // Eliminar servicio
  const handleDelete = async (id: number) => {
    try {
      const { data } = await deleteService(id); // data = { message, code }
      console.log(data.code)
      if (data.code === 5) {
        setNotification(data.message); // No se puede eliminar
        return;
      }
      setNotification("Servicio eliminado correctamente");

      // Refrescar lista desde backend
      const updated = await fetchServices();
      setServices(updated.sort((a, b) => a.id - b.id));

    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      setNotification("Error al eliminar el servicio");
    } finally {
      setShowConfirm(false);
      setSelectedService(null);
    }
  };

  // Limpiar notificación después de 3s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="services-page bg-light p-6 min-h-screen">
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

      {/* Modal ServiceForm */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ServiceForm
            service={selectedService}
            onClose={() => setShowForm(false)}
            onSave={handleSave}
          />
        </div>
      )}

      {/* Modal ConfirmDialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ConfirmDialog
            message={`¿Está seguro de que desea eliminar ${selectedService?.nombre}?`}
            onConfirm={() => handleDelete(selectedService!.id!)}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}

      {/* Notificación */}
      {notification && (
        <Notification message={notification} onClose={() => setNotification("")} />
      )}
    </div>
  );
}


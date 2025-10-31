import React, { useState, useEffect } from "react"
import ServiceTable from "../components/ServiceTable"
import ServiceForm from "../components/ServiceForm"
import ConfirmDialog from "../components/ConfirmDialog"
import Notification from "../components/Notification"

export default function AdminServicesPage() {
  const [services, setServices] = useState([
    { id: 1, name: "Limpieza dental", description: "Limpieza básica", price: 25, active: true },
    { id: 2, name: "Blanqueamiento", description: "Blanqueamiento dental", price: 50, active: true },
  ])
  const [selectedService, setSelectedService] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [notification, setNotification] = useState("")

  const handleAddOrUpdate = (service) => {
    if (service.id) {
      setServices(services.map(s => s.id === service.id ? service : s))
      setNotification("Servicio actualizado correctamente")
    } else {
      const newService = { ...service, id: Date.now() }
      setServices([...services, newService])
      setNotification("Servicio agregado correctamente")
    }
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id))
    setShowConfirm(false)
    setNotification("Servicio eliminado correctamente")
  }
  
useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000) // 3 segundos
      return () => clearTimeout(timer) // limpia el timer si cambia la notificación
    }
  }, [notification])

  return (
    <div className="services-page bg-light p-6 min-h-screen">
      <h1 className="text-3xl text-primary text-center mb-6 font-bold">Administrar Servicios</h1>
      <div className="flex justify-center mb-4">
      <button id="add-service-btn" className="btn-primary px-4 py-2 rounded hover:bg-accent mb-5" onClick={() => { setSelectedService(null); setShowForm(true) }}>
        Agregar Servicio
      </button>
      </div>
      
      <ServiceTable 
        services={services} 
        onEdit={service => { setSelectedService(service); setShowForm(true) }}
        onDelete={service => { setSelectedService(service); setShowConfirm(true) }}
      />

      {showForm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-light p-6 rounded-lg w-full max-w-md shadow-lg">
            <ServiceForm 
              service={selectedService} 
              onClose={() => setShowForm(false)} 
              onSave={handleAddOrUpdate}
            />
          </div>
        </div>
      )}

      {showConfirm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-light p-6 rounded-lg w-full max-w-sm shadow-lg text-center">
        <ConfirmDialog 
          message={`¿Está seguro de que desea eliminar ${selectedService?.name}?`}
          onConfirm={() => handleDelete(selectedService.id)}
          onCancel={() => setShowConfirm(false)}
        />
        </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 bg-success text-light px-4 py-2 rounded shadow-lg z-50">
          {notification}
          <button className="ml-2 font-bold" onClick={() => setNotification("")}>X</button>
        </div>
      )}
    </div>
  )
}

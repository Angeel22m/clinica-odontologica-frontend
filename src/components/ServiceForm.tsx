import React, { useState, useEffect } from "react"

export default function ServiceForm({ service, onClose, onSave }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [active, setActive] = useState(true)

  useEffect(() => {
    if(service){
      setName(service.name)
      setDescription(service.description)
      setPrice(service.price)
      setActive(service.active)
    }
  }, [service])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ id: service?.id, name, description, price, active })
  }

  return (
  <div className="modal-overlay">
    <div className="service-form-container bg-light p-6 rounded shadow-md w-full max-w-md mx-auto mt-6">
      <h2 id="service-form-title" classname="text-xl text-primary font-bold mb-4">{service ? "Editar Servicio" : "Nuevo Servicio"}</h2>
      <form id="service-form" onSubmit={handleSubmit}>
        
          <input id="service-name" className="form-input p-2 border border-primary rounded w-full" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required />
        
          <input id="service-description" className="form-input p-2 border border-primary rounded w-full" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" required />
        
          <input id="service-price" className="form-input p-2 border border-primary rounded w-full" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Precio" required />
        
          <label className="flex items-center gap-2">
            <input id="service-active" className="form-checkbox" type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} /> Activo
          </label>
        
        <div className="flex gap-2 mt-4">
          <button id="service-submit-btn" className="btn-primary px-4 py-2 rounded hover:bg-accent" type="submit">{service ? "Guardar Cambios" : "Agregar"}</button>
          <button id="service-cancel-btn" className="bg-accent text-light px-4 py-2 rounded hover:bg-info" type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
    </div>
  )
}

import React from "react"

export default function ServiceTable({ services, onEdit, onDelete }) {
  return (
    <table id="services-table" className="services-table w-full border-collapse">
      <thead className="bg-primary text-light">
        <tr>
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Descripción</th>
          <th className="p-2 text-left">Precio</th>
          <th className="p-2 text-left">Estado</th>
          <th className="p-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {services.map(service => (
          <tr className="service-row border-b border-light" key={service.id}>
            <td className="service-name p-2">{service.name}</td>
            <td className="service-desc p-2">{service.description}</td>
            <td className="service-price p-2">${service.price}</td>
            <td className={`service-status p-2 ${service.active ? "text-success" : "text-accent"}`}>{service.active ? "Activo" : "Inactivo"}</td>
            <td className="p-2">
              <button className="button button-edit btn-primary px-2 py-1 rounded mr-2" id={`edit-service-${service.id}`} onClick={() => onEdit(service)}>Editar</button>
              <button className="button button-delete bg-accent text-light px-2 py-1 rounded" id={`delete-service-${service.id}`} onClick={() => onDelete(service)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

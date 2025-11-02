import React from "react"
//import { motion } from "framer-motion";

export default function ServiceTable({ services, onEdit, onDelete }) {
  return (
  <div className="flex justify-center">
    <div className="overflow-x-auto w-[95%] md:w-[90%] rounded-lg shadow-md">
    <table id="services-table" className="min-w-full table-auto border-collapse">
      <thead className="bg-primary text-light rounded-t-lg">
        <tr>
          <th className="p-3 text-left">Nombre</th>
          <th className="p-3 text-left">Descripción</th>
          <th className="p-3 text-left">Precio</th>
          <th className="p-3 text-left">Estado</th>
          <th className="p-3 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {services.map(service => (
          <tr className="service-row border-b border-light" key={service.id}>
            <td className="service-name p-2 font-medium">{service.nombre}</td>
            <td className="service-desc p-2 truncate max-w-xs">{service.descripcion}</td>
            <td className="service-price p-2">${service.precio}</td>
            <td className={`service-status p-2 font-semibold ${service.activo ? "text-success" : "text-accent"}`}>{service.activo ? "Activo" : "Inactivo"}</td>
            <td className="p-2 flex space-x-2">
              <button className="button button-edit btn-primary px-2 py-1 rounded mr-2" id={`edit-service-${service.id}`} onClick={() => onEdit(service)}>Editar</button>
              <button className="button button-delete bg-accent text-light px-2 py-1 rounded mr-2" id={`delete-service-${service.id}`} onClick={() => onDelete(service)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  )
}

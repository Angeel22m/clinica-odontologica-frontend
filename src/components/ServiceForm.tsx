import React, { useState, useEffect } from "react";
import * as Service from "../types/Service";

interface Props {
  service: Service | null;
  onClose: () => void;
  onSave: (service: Omit<Service, "id"> & Partial<Pick<Service, "id">>) => void;
}

export default function ServiceForm({ service, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (service) {
      setNombre(service.nombre);
      setDescripcion(service.descripcion);
      setPrecio(service.precio);
      setActivo(service.activo);
    } else {
      // Limpiar campos si es nuevo
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setActivo(true);
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enviar solo tipos correctos
    onSave({
      id: service?.id,               // undefined si es nuevo
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Math.floor(precio),          // asegurar number
      activo: Boolean(activo),       // asegurar boolean
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="service-form-container bg-light p-6 rounded shadow-2xl w-full max-w-md mx-auto mt-6">
        <h2 className="text-xl text-primary font-bold mb-4">
          {service ? "Editar Servicio" : "Nuevo Servicio"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-input p-2 border border-primary rounded w-full mb-2"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
          <input
            className="form-input p-2 border border-primary rounded w-full mb-2"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción"
            required
          />
          <input
            className="form-input p-2 border border-primary rounded w-full mb-2"
            type="string"
            value={precio}
            onChange={e => setPrecio(Number(e.target.value))}
            placeholder="Precio"
            required
          />
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={activo}
              onChange={e => setActivo(e.target.checked)}
            />{" "}
            Activo
          </label>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary px-4 py-2 rounded" type="submit">
              {service ? "Guardar Cambios" : "Agregar"}
            </button>
            <button
              className="bg-accent text-light px-4 py-2 rounded"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


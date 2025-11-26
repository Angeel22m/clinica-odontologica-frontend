import React, { useState, useEffect } from "react";
import * as Service from "../types/Service";

interface Props {
  service: Service | null;
  onClose: () => void;
  onSave: (service: Omit<Service, "id"> & Partial<Pick<Service, "id">>) => void;
  allSpecialties:{ id: number; nombre: string }[];
}


export default function ServiceForm({ service, onClose, onSave, allSpecialties }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [activo, setActivo] = useState(true);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>([]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value: number[] = [];
    
    // Recorre las opciones seleccionadas y captura su valor (ID)
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        // Aseguramos que el valor sea numérico (el ID)
        value.push(Number(options[i].value)); 
      }
    }
    setSelectedSpecialtyIds(value);
  };

 // carga las especialidades
  useEffect(() => {
    if (service) {
      setNombre(service.nombre);
      setDescripcion(service.descripcion);
      setPrecio(service.precio);
      setActivo(service.activo);

      const currentIds = service.especialidades
        .map(se => se.especialidad?.id)
        .filter((id): id is number => id !== undefined);
      setSelectedSpecialtyIds(currentIds);
    } else {
      // Limpiar campos si es nuevo
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setActivo(true);
      setSelectedSpecialtyIds([]);
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
      especialidadIds: selectedSpecialtyIds,
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
          {/*  SELECTOR DE ESPECIALIDADES MÚLTIPLE  */}
          <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mt-2">
            Especialidades
          </label>
          <select
            id="specialties"
            className="form-select p-2 border border-primary rounded w-full mb-2"
            multiple // Permite seleccionar múltiples opciones
            value={selectedSpecialtyIds.map(String)} // Los IDs deben ser strings para el campo multiple
            onChange={handleSelectChange}
            required
            size={Math.min(5, allSpecialties.length)} 
          >
            {allSpecialties.map(specialty => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.nombre}
              </option>
            ))}
          </select>
          {/*  FIN SELECTOR DE ESPECIALIDADES  */}
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


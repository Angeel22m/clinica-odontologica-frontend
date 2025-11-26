// src/components/EspecialidadForm.tsx
import React, { useState, useEffect } from "react";
import * as EspecialidadType from "../../types/especialidad";

interface Props {
  especialidad: EspecialidadType.Especialidad | null;
  onClose: () => void;
  onSave: (
    esp: Omit<EspecialidadType.Especialidad, "id"> &
      Partial<Pick<EspecialidadType.Especialidad, "id">>
  ) => void;
}

export default function EspecialidadForm({ especialidad, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (especialidad) {
      setNombre(especialidad.nombre);
      setDescripcion(especialidad.descripcion);
    }
  }, [especialidad]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: especialidad?.id,
      nombre,
      descripcion,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
    <div className="service-form-container bg-light p-6 rounded shadow-2xl w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold text-primary mb-4 text-center">
        {especialidad ? "Editar Especialidad" : "Agregar Especialidad"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="font-semibold text-primary">Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full border rounded-lg px-3 py-2"
            value={nombre}
            required
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-primary">Descripción</label>
          <textarea
            placeholder="Descripción"
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            value={descripcion}
            required
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button type="submit" className="btn-primary px-4 py-2 rounded-lg">
            {especialidad ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}

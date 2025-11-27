// src/components/EspecialidadTable.tsx
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import * as EspecialidadType from "../../types/especialidad";

interface Props {
  especialidades: EspecialidadType.Especialidad[];
  onEdit: (esp: EspecialidadType.Especialidad) => void;
  onDelete: (esp: EspecialidadType.Especialidad) => void;
}

export default function EspecialidadTable({ especialidades, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-accent">
      <table className="min-w-full text-primary">
        <thead className="bg-accent text-primary font-semibold">
          <tr>
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left">Descripción</th>
            <th className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {especialidades.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center">
                No se encontraron resultados
              </td>
            </tr>
          ) : (
            especialidades.map((esp) => (
              <tr key={esp.id} className="border-b">
                <td className="py-3 px-4">{esp.nombre}</td>
                <td className="py-3 px-4">{esp.descripcion}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onEdit(esp)}
                    className="text-blue-600 hover:text-blue-800 mx-2"
                  >
                    <FiEdit size={20} />
                  </button>

                  <button
                    onClick={() => onDelete(esp)}
                    className="text-red-600 hover:text-red-800 mx-2"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

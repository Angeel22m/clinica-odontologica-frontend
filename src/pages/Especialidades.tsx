// src/pages/AdminEspecialidadesPage.tsx
import React, { useState, useEffect } from "react";
import EspecialidadTable from "../components/EspecialidadesComponentes/EspecialidadTable";
import EspecialidadForm from "../components/EspecialidadesComponentes/EspecialidadForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";

import {
  fetchEspecialidades,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
} from "../services/especialidad";

import * as EspecialidadType from "../types/especialidad";

import { Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

export default function AdminEspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<EspecialidadType.Especialidad[]>([]);
  const [selectedEspecialidad, setSelectedEspecialidad] =
    useState<EspecialidadType.Especialidad | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notification, setNotification] = useState("");

  // Buscador
  const [search, setSearch] = useState("");

  // Paginación
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        const data = await fetchEspecialidades();
        setEspecialidades(data.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
        setNotification("Error al cargar las especialidades");
      }
    };
    loadEspecialidades();
  }, []);

  // FILTRO
  const filtered = especialidades.filter(
    (e) =>
      e.nombre.toLowerCase().includes(search.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINACIÓN
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const paginated = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

 const handleSave = async (
  esp: Omit<EspecialidadType.Especialidad, "id"> &
    Partial<Pick<EspecialidadType.Especialidad, "id">>
) => {
  try {
    // ---------------------------
    // VALIDACIÓN DUPLICADOS (FRONT)
    // ---------------------------
    const nombreNormalizado = esp.nombre.trim().toLowerCase();

    const yaExiste = especialidades.some(
      (e) =>
        e.nombre.trim().toLowerCase() === nombreNormalizado &&
        e.id !== esp.id
    );

    if (yaExiste) {
      setNotification("La especialidad ya existe.");
      return;
    }

    // ---------------------------
    // GUARDAR (CREATE / UPDATE)
    // ---------------------------
    if (esp.id) {
      // EDITAR
      await updateEspecialidad(esp.id, {
        nombre: esp.nombre,
        descripcion: esp.descripcion,
      });

      setNotification("Especialidad actualizada correctamente");
    } else {
      // CREAR
      await createEspecialidad({
        nombre: esp.nombre,
        descripcion: esp.descripcion,
      });

      setNotification("Especialidad agregada correctamente");
    }

    // Recargar lista
    const updated = await fetchEspecialidades();
    setEspecialidades(updated.sort((a, b) => a.id - b.id));

  } catch (error: any) {
    console.error("Error al guardar especialidad:", error);

    // Mensaje genérico SIEMPRE que el backend falle
    setNotification("Error al crear la especialidad. Intente de nuevo más tarde.");
  } finally {
    setShowForm(false);
    setSelectedEspecialidad(null);
  }
};



  const handleDelete = async (id: number) => {
    try {
      const { data } = await deleteEspecialidad(id);

      if (data.code === 5) {
        setNotification(data.message);
        return;
      }

      setNotification(data.message);

      const updated = await fetchEspecialidades();
      setEspecialidades(updated.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error("Error al eliminar especialidad:", error);
      setNotification("Error al eliminar la especialidad");
    } finally {
      setShowConfirm(false);
      setSelectedEspecialidad(null);
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
          Regresar
        </Link>
      </button>

      <h1 className="text-3xl text-primary text-center mb-6 font-bold">
        Administrar Especialidades
      </h1>

      {/* BUSCADOR */}
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Buscar especialidad..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-72 border px-4 py-2 rounded-lg"
        />
      </div>

      {/* BOTÓN */}
      <div className="flex justify-center mb-4">
        <button
          className="btn-primary px-4 py-2 rounded hover:bg-accent mb-5"
          onClick={() => {
            setSelectedEspecialidad(null);
            setShowForm(true);
          }}
        >
          Agregar Especialidad
        </button>
      </div>

      {/* TABLA */}
      <EspecialidadTable
        especialidades={paginated}
        onEdit={(especialidad) => {
          setSelectedEspecialidad(especialidad);
          setShowForm(true);
        }}
        onDelete={(especialidad) => {
          setSelectedEspecialidad(especialidad);
          setShowConfirm(true);
        }}
      />

      {/* PAGINACIÓN */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="btn-primary px-3 py-1 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Anterior
        </button>

        <span className="text-primary font-semibold">
          Página {currentPage} / {totalPages || 1}
        </span>

        <button
          className="btn-primary px-3 py-1 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <EspecialidadForm
            especialidad={selectedEspecialidad}
            onClose={() => setShowForm(false)}
            onSave={handleSave}
          />
        </div>
      )}

      {/* CONFIRM DIALOG */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ConfirmDialog
            message={`¿Está seguro de que desea eliminar ${selectedEspecialidad?.nombre}?`}
            onConfirm={() => handleDelete(selectedEspecialidad!.id!)}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}

      {/* NOTIFICACIÓN */}
      {notification && (
        <Notification message={notification} onClose={() => setNotification("")} />
      )}
    </div>
  );
}

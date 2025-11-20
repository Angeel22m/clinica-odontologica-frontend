import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Stethoscope, Upload, Pencil, FileText,Heart } from "lucide-react";
import { BriefcaseMedical, Pill } from 'lucide-react';
import FileUploader from "./FileUploader";
import EditExpedienteForm from "../components/EditarExpedienteForm";
import { getExpedienteById } from "../services/expedientesService"; // tu función para fetch backend
import type { Archivo } from "../types/expediente";
import NuevoDetalleForm from "./NuevoDetalleForm";


export const ExpedienteDetalle: React.FC<{ expedienteId: number; onBack: () => void }> = ({ expedienteId, onBack }) => {
  const [expediente, setExpediente] = useState<any>(null);
  const [ascending, setAscending] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagenAbierta, setImagenAbierta] = useState<string | null>(null);
  const [showNuevoDetalleModal, setShowNuevoDetalleModal] = useState(false);


  // Cargar expediente
  const fetchExpediente = async () => {
    try {
      const data = await getExpedienteById(expedienteId);
      setExpediente(data);
    } catch (err) {
      console.error("Error al obtener expediente:", err);
    }
  };

  useEffect(() => {
    fetchExpediente();
  }, [expedienteId]);

  // Ordenar consultas
  const sorted = useMemo(() => {
    if (!expediente?.detalles) return [];
    return [...expediente.detalles].sort((a, b) =>
      ascending
        ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        : new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [expediente?.detalles, ascending]);

  // Callback al subir archivo
  const handleUploadSuccess = async () => {
    setShowUploader(false);
    await fetchExpediente(); // recargar datos
  };

  // Callback al editar expediente
  const handleEditSuccess = async () => {
    setShowEditModal(false);
    await fetchExpediente(); // recargar datos
  };

  if (!expediente) return <p>Cargando expediente...</p>;

  return (
    <div className="relative p-6 bg-light rounded-xl shadow-xl">

      {/* Encabezado */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">{expediente.nombrePaciente}</h2>          
        </div>
        <button onClick={() => setShowEditModal(true)} className="btn-accent">
          <Pencil className="w-4 h-4" /> Editar Expediente
        </button>
      </div>

      {/* Botones */}
      <div className="mb-4 flex items-center gap-2">
        <button
  onClick={() => setShowNuevoDetalleModal(true)}
  className="btn-accent"
>
  <Stethoscope className="w-4 h-4" /> Nueva Consulta
</button>



        <button
  onClick={() => setShowUploader(true)}
  className="btn-accent"
>
  <Upload className="w-4 h-4" /> Adjuntar Archivo
</button>

        {expediente.detalles?.length > 0 && (
          <button onClick={() => setAscending(!ascending)} className="btn-nueva-consulta">
            {ascending ? "▲ Ascendente" : "▼ Descendente"}
          </button>

        )}
      </div>

     {/* Información básica con iconos */}
<div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-primary">
  <div className="flex items-center gap-2">
    <Heart className="w-4 h-4 text-accent" />
    <span className="font-semibold">Alergias:</span>
    <div className="w-24 break-words">
    {expediente.alergias || 'N/A'}
    </div>
  </div>
  <div className="flex items-center gap-2">
    <BriefcaseMedical className="w-4 h-4 text-info" />
    <span className="font-semibold">Enfermedades:</span> 
    <div className="w-32 break-words">
    {expediente.enfermedades || 'N/A'}
    </div>
  </div>
  <div className="flex items-center gap-2">
    <Pill className="w-4 h-4 text-success" />
    <span className="font-semibold">Medicamentos:</span>
    <div className="w-28 break-words">
    {expediente.medicamentos || 'N/A'}
    </div>
  </div>
  <div className="flex items-center gap-2">
    <Stethoscope className="w-4 h-4 text-primary" />
    <span className="font-semibold">observaciones:</span>
    <div className="w-28 break-words">
    {expediente.observaciones || 'N/A'}
    </div>
  </div>
</div>



      {/* Consultas */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-primary mb-2">Consultas</h3>
        {sorted.length === 0 ? <p className="text-secondary text-sm">No hay consultas registradas.</p> :
          <div className="space-y-4">
            {sorted.map(d => (
              <div key={d.id} className="p-4 bg-light border-l-4 border-accent rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-accent font-semibold flex items-center">
                    <Stethoscope className="w-4 h-4 mr-1" /> Consulta
                  </h4>
                  <p className="text-sm text-info flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> {new Date(d.fecha).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <p><strong>Motivo:</strong> {d.motivo}</p>
                <p><strong>Diagnóstico:</strong> {d.diagnostico}</p>
                <p><strong>Tratamiento:</strong> {d.tratamiento}</p>
                <p><strong>Plan:</strong> <span className="text-success">{d.planTratamiento}</span></p>
              </div>
            ))}
          </div>}
      </div>

      {/* Archivos */}
      {expediente.archivos?.length > 0 && (
  <div>
    <h3 className="text-2xl font-semibold text-primary mb-3">Archivos</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {(expediente.archivos as Archivo[]).map((a: Archivo) => (
        <div key={a.id} className="relative group">
          {a.type?.startsWith("image") ? (
            <img
              src={a.url}
              alt={a.nombre}
              className="rounded-lg shadow-md object-cover w-full h-40 cursor-pointer"
              onClick={() => setImagenAbierta(a.url)}
            />
          ) : (
            <div
              className="rounded-lg shadow-md w-full h-40 flex items-center justify-center bg-gray-100 text-gray-700 font-bold text-center cursor-pointer"
              onClick={() => window.open(a.url, "_blank")}
            >
              <FileText className="w-6 h-6 mb-1" /> {a.nombre}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}    

<NuevoDetalleForm
  expedienteId={expedienteId}
  doctorId={1} // reemplazar con el doctor actual
  open={showNuevoDetalleModal}
  onClose={() => setShowNuevoDetalleModal(false)}
  onSuccess={fetchExpediente}
/>



      {/* Modal Imagen */}
      {imagenAbierta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setImagenAbierta(null)}>
          <img src={imagenAbierta} alt="Preview" className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg" />
        </div>
      )}

      {/* Modal Edición */}
      <EditExpedienteForm expedienteId={expedienteId} open={showEditModal} onClose={() => setShowEditModal(false)} initialData={expediente} onSuccess={handleEditSuccess} />

      {/* FileUploader */}
      {showUploader && (
        <FileUploader expedienteId={expedienteId} creadoPorId={1} open={showUploader} onUploadSuccess={handleUploadSuccess} onClose={() => setShowUploader(false)} />
      )}
    </div>
  );
};

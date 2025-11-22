import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Stethoscope, FileText,Heart } from "lucide-react";
import { BriefcaseMedical, Pill } from 'lucide-react';
import { getExpedienteByIdPaciente } from "../services/expedientesService"; // tu función para fetch backend
import type { Archivo } from "../types/expediente";
import { Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

const HistorialdelPaciente: React.FC<{ pacienteId: number}> = ({ pacienteId}) => {
  const [expediente, setExpediente] = useState<any>(null);
  const [ascending, setAscending] = useState(false);
  const [imagenAbierta, setImagenAbierta] = useState<string | null>(null);

  // Cargar expediente
  const fetchExpediente = async () => {
    try {
      const data = await getExpedienteByIdPaciente(pacienteId);
      setExpediente(data);
    } catch (err) {
      console.error("Error al obtener expediente:", err);
    }
  };

  useEffect(() => {
    fetchExpediente();
  }, [pacienteId]);

  // Ordenar consultas
  const sorted = useMemo(() => {
    if (!expediente?.detalles) return [];
    return [...expediente.detalles].sort((a, b) =>
      ascending
        ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        : new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [expediente?.detalles, ascending]);

  if (!expediente) return <p>Cargando expediente...</p>;

  return (
    <div className="relative p-6 bg-light rounded-xl shadow-xl m-8">
        
        
        <button>
      <Link className="btn-primary flex items-center gap-1" to={"/home/paciente"}>
      <FiChevronLeft />
      Regresar</Link>
        </button>
        
        
	

      {/* Encabezado */}
      <div className="flex justify-between items-start mt-4 mb-4">
        <div>
        
          <h2 className="text-3xl font-bold text-primary mb-2">{expediente.nombrePaciente}</h2>
        

        </div>
        
      </div>

      {/* Botones */}
      <div className="mb-4 flex items-center gap-2">
        

        {expediente.detalles?.length > 0 && (
          <button onClick={() => setAscending(!ascending)} className="btn-nueva-consulta">
            {ascending ? "▲ Ascendente" : "▼ Descendente"}
          </button>

        )}
      </div>

     {/* Información básica con iconos */}
<div className="mt-4 mb-2 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-primary">
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
    <div className="w-40 break-words">
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
    <Pill className="w-4 h-4 text-success" />
    <span className="font-semibold">Observaciones:</span>
    <div className="w-28 break-words">
    {expediente.Observaciones || 'N/A'}
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
      {/* Modal Imagen */}
      {imagenAbierta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay-dark" onClick={() => setImagenAbierta(null)}>
          <img src={imagenAbierta} alt="Preview" className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg" />
        </div>
      )}

    </div>
  );
};

export default HistorialdelPaciente;

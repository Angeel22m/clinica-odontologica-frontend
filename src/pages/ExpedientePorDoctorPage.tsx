import React, { useEffect, useState } from "react";
import { ExpedientesList } from "../components/ExpedienteList";
import { ExpedienteDetalle } from "../components/ExpedienteDetails";
import { ArrowLeftCircle } from "lucide-react";
import { fetchExpedientesByDoctor } from "../services/expedientesService";
import type { Expediente } from "../types/expediente";
import { Link,useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";


interface Props {
  doctorId: number;
}

type ExpedienteConNombres = Expediente & {
  nombrePaciente: string;
};

const ExpedientesPagePorDoctor: React.FC<Props> = ({ doctorId }) => {
  const [expedientes, setExpedientes] = useState<ExpedienteConNombres[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { expedienteId } = useParams<{ expedienteId: string }>();
  const navigate = useNavigate();
  const urlExpedienteId = expedienteId ? parseInt(expedienteId) : null;

  const initialSelectedId = expedienteId ? parseInt(expedienteId) : null;
  useEffect(() => {
        // Si el ID de la URL es diferente al ID actual seleccionado, actualízalo.
        if (urlExpedienteId !== selectedId) {
            setSelectedId(urlExpedienteId);
        }
    }, [urlExpedienteId, selectedId]);

    const currentExpedienteId = selectedId || urlExpedienteId;

  const handleSelectExpediente = (id: number | null) => {
    setSelectedId(id);
    
    // Construye la nueva URL
    const baseUrl = `/expedientes/doctor`;
    
    if (id) {
        // Navega a /expedientes/doctor/123
        navigate(`${baseUrl}/${id}`);
    } else {
        // Navega de vuelta a /expedientes/doctor
        navigate(baseUrl);
    }
  };
  

  useEffect(() => {
    const loadExpedientes = async () => {
      try {
        setLoading(true);
        const data = await fetchExpedientesByDoctor(doctorId);

        const mapped: ExpedienteConNombres[] = data.map((exp) => ({
    ...exp,
    nombrePaciente: `${exp.paciente.nombre} ${exp.paciente.apellido}`,  
    
      }));

        setExpedientes(mapped);
      } catch (err: unknown) {
        console.error(err);
        setError("No se pudieron cargar los expedientes.");        
      } finally {
        setLoading(false);
      }
    };

    loadExpedientes();
  }, [doctorId]);

  const expedienteSeleccionado = expedientes.find((e) => e.id === currentExpedienteId);

  if (loading) return <div className="p-6 text-center">Cargando expedientes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (expedientes.length === 0) return <div className="p-6 text-center">No hay expedientes disponibles.</div>;

  return (
  <div className="min-h-screen bg-light p-6 relative">
      
        <button>
     <Link className="btn-primary flex items-center gap-1" to={"/citas/doctor"}>
        <FiChevronLeft />
        
        Regresar</Link>

        </button>
   
      

      <div className="max-w-6xl mx-auto bg-light rounded-xl shadow-2xl p-6">
        {!expedienteSeleccionado ? (
          <>
            <h1 className="text-4xl font-bold text-primary mb-6">Gestión de Expedientes</h1>
            {/* 4. Usar el nuevo handler para seleccionar */}
            <ExpedientesList expedientes={expedientes} onSelect={handleSelectExpediente} /> 
          </>
        ) : (
          <div>
            <button
              // 5. Usar el nuevo handler para volver a la lista
              onClick={() => handleSelectExpediente(null)} 
              className="flex items-center gap-2 mb-6 text-accent hover:text-info transition cursor-pointer hover:scale-[1.03] transition duration-200 ease-in-out">
              <ArrowLeftCircle className="w-6 h-6" />
              <span className="font-medium">Volver a lista</span>
            </button>

            <ExpedienteDetalle 
                expedienteId={expedienteSeleccionado.id} 
                // 6. Usar el nuevo handler para el botón de regreso
                onBack={() => handleSelectExpediente(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpedientesPagePorDoctor;

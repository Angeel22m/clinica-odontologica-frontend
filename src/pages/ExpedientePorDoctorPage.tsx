import React, { useEffect, useState } from "react";
import { ExpedientesList } from "../components/ExpedienteList";
import { ExpedienteDetalle } from "../components/ExpedienteDetails";
import { ArrowLeftCircle } from "lucide-react";
import { fetchExpedientesByDoctor } from "../services/expedientesService";
import type { Expediente } from "../types/expediente";
import { Link,useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { useAuth } from "../hooks/UseAuth";

type ExpedienteConNombres = Expediente & {
  nombrePaciente: string;
};

const ExpedientesPagePorDoctor: React.FC = () => {
  const [expedientes, setExpedientes] = useState<ExpedienteConNombres[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { expedienteId } = useParams<{ expedienteId: string }>();
  const navigate = useNavigate();
  const urlExpedienteId = expedienteId ? parseInt(expedienteId) : null;
  const {idEmpleado} =useAuth();

  const initialSelectedId = expedienteId ? parseInt(expedienteId) : null;

  useEffect(() => {
        // Si el ID de la URL es diferente al ID actual seleccionado, actualízalo.
        if (urlExpedienteId !== selectedId) {
            setSelectedId(urlExpedienteId);
        }
    }, [urlExpedienteId, selectedId]);

    const currentExpedienteId = selectedId || urlExpedienteId;

const handleSelectExpediente = (id: number | null) => {
    // 1. Actualizamos el estado local
    setSelectedId(id);
    
    // 2. Lógica de navegación
    if (id) {
        // CASO: Seleccionar un ID
        if (urlExpedienteId) {
            // Si YA estamos en una ruta con ID (ej: /expedientes/1) y queremos ir a otro (ej: /expedientes/2),
            // usamos ".." para "salir" del 1 y entrar al 2.
            navigate(`../${id}`, { relative: "path" });
        } else {
            // Si estamos en la ruta principal (ej: /expedientes) y entramos a uno
            navigate(`${id}`);
        }
    } else {
        // CASO: Quitar el ID (Regresar a principal)
        // Solo navegamos atrás si actualmente hay un ID en la URL
        if (urlExpedienteId) {
            navigate("..", { relative: "path" });
        }
    }
};
  

  useEffect(() => {
    const loadExpedientes = async () => {

        if (!idEmpleado || idEmpleado <= 0) {
          console.log('Esperando ID de empleado para cargar expedientes...');
          setLoading(false);
          return;
      }



      try {
        setLoading(true);
        console.log(idEmpleado)
        const data = await fetchExpedientesByDoctor(idEmpleado);

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
  }, [idEmpleado]);
  console.log('id de la ruta')
  console.log(currentExpedienteId)
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
                pacienteId={expedienteSeleccionado.pacienteId} 
                doctorId={idEmpleado}
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

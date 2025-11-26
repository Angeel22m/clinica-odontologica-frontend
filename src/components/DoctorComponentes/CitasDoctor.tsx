import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";
import { fetchExpedientes } from "../../services/CitasDoctor/CitasServices";
import type { Cita } from "../../types/TypesCitas/CitasPorDoctor";
import CitaCard from "./CitaCard";
import { useAuth } from "../../hooks/UseAuth"; // Hook de autenticación
import socket from "../../config/socket"; // Importa la instancia del socket

const ITEMS_PER_PAGE = 6;

const CitasDoctor: React.FC = () => {
  const { idEmpleado } = useAuth(); 
  const [ascending, setAscending] = useState(false);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
    const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    // getMonth() es base 0, por eso se suma 1. padStart asegura que sea '01' en lugar de '1'
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [filtroEstado, setFiltroEstado] = useState("CONFIRMADA"); 
  const [filtroTiempo, setFiltroTiempo] = useState<"todos" | "dia" | "semana" | "mes">("dia");    
  const [fechaEspecifica, setFechaEspecifica] = useState(getTodayDate()); // YYYY-MM-DD
  const [currentPage, setCurrentPage] = useState(1);  
  const filterButton = (id: string, active: string) =>
    `px-3 py-1 text-xs rounded-full border shadow-sm ${
      active === id
        ? "bg-success text-primary border-primary"
        : "bg-light text-primary/70"
    }`;


  // ==========================================================
  // CARGAR CITAS DEL DOCTOR DESDE LA API
  // ==========================================================
const loadCitas = useCallback(async () => {
    if (!idEmpleado || idEmpleado <= 0) return;

    try {
      setLoading(true);
      const data = await fetchExpedientes(idEmpleado);
      setCitas(Array.isArray(data) ? data : [data]);
      setError("");
    } catch (err) {
      console.error("Error al cargar citas:", err);
      setError("No se pudieron cargar las citas del doctor");
    } finally {
      setLoading(false);
    }
  }, [idEmpleado]);

useEffect(() => {
    // Se ejecuta al montar o cuando loadCitas cambie (sólo si cambia idEmpleado)
    loadCitas(); 
  }, [loadCitas]);

useEffect(() => {
    
    const handleCitaCancelada = (data:number) => {              
        if (data === idEmpleado) { 
            
            
            loadCitas(); 
            
            // 3. UI/UX: Mostrar una notificación

        }
    };

    // Suscribirse al evento
    socket.on('updateCitasDoctor', handleCitaCancelada);

    // FUNCIÓN DE LIMPIEZA: Desuscribirse al desmontar para evitar duplicados
    return () => {
      socket.off('updateCitasDoctor', handleCitaCancelada);
    };
    // Dependencias: idEmpleado y loadCitas para que el handler siempre tenga la última versión
  }, [idEmpleado, loadCitas]);


  //filtros
const citasFiltradas = useMemo(() => {
  let data = [...citas];

  // Filtrar por estado
  if (filtroEstado !== "todos") {
    data = data.filter((c) => c.estado === filtroEstado);
  }

  // Filtrar por día (se activa si filtroTiempo es "dia" y tenemos una fecha)
  if (filtroTiempo === "dia" && fechaEspecifica) {
    data = data.filter((c) => c.fecha?.substring(0, 10) === fechaEspecifica);
  }
  
  // TODO: Agregar lógica de filtrado para "semana" y "mes" si es necesario.

  data.sort((a, b) => {
      // Convertimos la fecha (cadena) a un objeto Date para compararla
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();

      if (ascending) {
        // Orden Ascendente (fecha más antigua primero)
        return fechaA - fechaB;
      } else {
        // Orden Descendente (fecha más reciente primero)
        return fechaB - fechaA;
      }
    });

  return data;
}, [citas, filtroEstado, filtroTiempo, fechaEspecifica,ascending]);


  const totalPages = Math.ceil(citasFiltradas.length / ITEMS_PER_PAGE);

  const citasPaginadas = citasFiltradas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ==========================================================
  // RENDER
  // ==========================================================
  if (loading)
    return (
      <p className="text-center text-primary py-10">Cargando citas...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-10 font-semibold">{error}</p>
    );

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
        <FiCalendar /> Próximas Citas
        <span className="text-accent">({citasFiltradas.length})</span>
      </h1>
       {citas.length > 0 && (
          <button onClick={() => setAscending(!ascending)} className="btn-primary">
            {ascending ? "▲ Ascendente" : "▼ Descendente"}
          </button>

        )}

      {/* FILTROS */}
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        {/* FILTRO TIEMPO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <FiClock className="w-5 h-5" />
            <span>Filtrar por tiempo:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 [&>*]:cursor-pointer">
            <button
              className={filterButton("todos", filtroTiempo)}
              // Al seleccionar "Todas", limpiamos el filtro de fecha específica
              onClick={() => {
                setFiltroTiempo("todos");
                setFechaEspecifica(""); 
              }}
            >
              Todas
            </button>
            
            <button
              className={filterButton("dia", filtroTiempo)}
              // Al seleccionar "Hoy", forzamos el filtro al día actual
              onClick={() => {
                setFiltroTiempo("dia");
                setFechaEspecifica(getTodayDate()); 
              }}
            >
              Hoy
            </button>

            <input
              type="date"
              value={fechaEspecifica}
              onChange={(e) => {
                setFechaEspecifica(e.target.value);
                setFiltroTiempo("dia");
              }}
              className="text-xs p-1 border rounded-md cursor-pointer"
            />
          </div>
        </div>

        {/* FILTRO ESTADO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <FiCheckCircle className="w-5 h-5" />
            <span>Filtrar por estado:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 [&>*]:cursor-pointer">
            <button
              className={filterButton("todos", filtroEstado)}
              onClick={() => setFiltroEstado("todos")}
            >
              Todos
            </button>
            <button
              className={filterButton("PENDIENTE", filtroEstado)}
              onClick={() => setFiltroEstado("PENDIENTE")}
            >
              Pendientes
            </button>
            <button
              className={filterButton("CONFIRMADA", filtroEstado)}
              onClick={() => setFiltroEstado("CONFIRMADA")}
            >
              Confirmadas
            </button>
            <button
              className={filterButton("CANCELADA", filtroEstado)}
              onClick={() => setFiltroEstado("CANCELADA")}
            >
              Canceladas
            </button>
            <button
              className={filterButton("COMPLETADA", filtroEstado)}
              onClick={() => setFiltroEstado("COMPLETADA")}
            >
              Completadas
            </button>
          </div>
        </div>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex flex-wrap justify-center gap-2 overflow-x-auto py-2 [&>*]:cursor-pointer">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md text-sm border flex-shrink-0 ${
              currentPage === i + 1 ? "bg-primary text-white" : "bg-light"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="max-h-[28rem] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {citasPaginadas.map((c) => (
            <CitaCard key={c.id} cita={c} />
          ))}

          {citasFiltradas.length === 0 && (
            <p className="text-center text-primary/60 py-10 col-span-2">
              No hay citas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitasDoctor;
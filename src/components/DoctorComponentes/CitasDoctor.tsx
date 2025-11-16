import React, { useState, useMemo } from 'react';
import { FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";
import type {Servicio,Cita,Paciente} from "../../types/TypesCitas/CitasPorDoctor"
import CitaCard from './CitaCard';

const mockCitasData: Cita[] = (() => {
  const paciente1: Paciente = {
    id: 1, nombre: "Carlos", apellido: "Mendoza", dni: "080119900001",
    telefono: "9991001", direccion: "Centro 123", fechaNac: "1990-01-10",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };

  const paciente2: Paciente = {
    id: 2, nombre: "Sofía", apellido: "Ramírez", dni: "090219850002",
    telefono: "8882002", direccion: "Colonia Sur 45", fechaNac: "1985-02-09",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };

  const servicio1: Servicio = {
    id: 2, nombre: "Extracción de muela", descripcion: "Extracción dental simple",
    precio: 1200, activo: true, createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const servicio2: Servicio = {
    id: 5, nombre: "Limpieza y Fluor", descripcion: "Limpieza profunda",
    precio: 850, activo: true, createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const horarios = [
    "H08_00", "H08_30", "H09_00", "H09_30", "H10_00", "H10_30",
    "H11_00", "H11_30", "H12_00", "H13_00", "H13_30", "H14_00",
    "H14_30", "H15_00", "H15_30", "H16_00", "H16_30", "H17_00",
    "H17_30", "H17_45"
  ];

  let idCounter = 100;
  const citas: Cita[] = [];

  for (let day = 17; day <= 24; day++) {
    const fecha = `2025-11-${day.toString().padStart(2, "0")}T00:00:00.000Z`;

    horarios.forEach((h, i) => {
      const paciente = i % 2 === 0 ? paciente1 : paciente2;
      const servicio = i % 3 === 0 ? servicio2 : servicio1;

      let estado: Cita["estado"] = "PENDIENTE";
      if (i % 3 === 1) estado = "CONFIRMADA";
      if (i % 3 === 2) estado = "CANCELADA";

      citas.push({
        id: idCounter++,
        fecha,
        estado,
        hora: h,
        pacienteId: paciente.id,
        doctorId: 3,
        servicioId: servicio.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        servicio,
        paciente
      });
    });
  }

  return citas;
})();

const ITEMS_PER_PAGE = 8;

const CitasDoctor: React.FC = () => {
  const [filtroTiempo, setFiltroTiempo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [fechaEspecifica, setFechaEspecifica] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filterButton = (id: string, active: string) =>
    `px-3 py-1 text-xs rounded-full border shadow-sm ${
      active === id ? "bg-accent text-primary border-primary" : "bg-light text-primary/70"
    }`;

  // ---------------------------------------
  // LÓGICA DE FILTRO
  // ---------------------------------------
  const citasFiltradas = useMemo(() => {
    let data = [...mockCitasData];

    if (filtroEstado !== "todos")
      data = data.filter(c => c.estado === filtroEstado);

    if (filtroTiempo === "dia" && fechaEspecifica)
      data = data.filter(c => c.fecha.startsWith(fechaEspecifica));

    return data;
  }, [filtroTiempo, filtroEstado, fechaEspecifica]);

  const totalPages = Math.ceil(citasFiltradas.length / ITEMS_PER_PAGE);

  const citasPaginadas = citasFiltradas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
        <FiCalendar /> Próximas Citas
        <span className="text-accent">({citasFiltradas.length})</span>
      </h1>

      {/* ------------------------------------------------------- */}
{/*           FILTROS (CLAROS Y RESPONSIVE)               */}
{/* ------------------------------------------------------- */}
<div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4">

  {/* FILTRO POR TIEMPO */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
    <div className="flex items-center gap-2 text-primary font-semibold">
      <FiClock className="w-5 h-5" />
      <span>Filtrar por tiempo:</span>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <button className={filterButton("todos", filtroTiempo)} onClick={() => setFiltroTiempo("todos")}>
        Todas
      </button>
      <button className={filterButton("dia", filtroTiempo)} onClick={() => setFiltroTiempo("dia")}>
        Día
      </button>
      <input
        type="date"
        value={fechaEspecifica}
        onChange={e => {
          setFechaEspecifica(e.target.value);
          setFiltroTiempo("dia");
        }}
        className="text-xs p-1 border rounded-md"
        title="Selecciona una fecha específica"
      />
    </div>
  </div>

  {/* FILTRO POR ESTADO */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
    <div className="flex items-center gap-2 text-primary font-semibold">
      <FiCheckCircle className="w-5 h-5" />
      <span>Filtrar por estado:</span>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <button className={filterButton("todos", filtroEstado)} onClick={() => setFiltroEstado("todos")}>
        Todos
      </button>
      <button className={filterButton("PENDIENTE", filtroEstado)} onClick={() => setFiltroEstado("PENDIENTE")}>
        Pendientes
      </button>
      <button className={filterButton("CONFIRMADA", filtroEstado)} onClick={() => setFiltroEstado("CONFIRMADA")}>
        Confirmadas
      </button>
      <button className={filterButton("CANCELADA", filtroEstado)} onClick={() => setFiltroEstado("CANCELADA")}>
        Canceladas
      </button>
    </div>
  </div>
</div>
{/* ------------------------------------------------------- */}


       {/* PAGINACIÓN */}
<div className="flex flex-wrap justify-center gap-2 overflow-x-auto py-2">
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


      {/* LISTA CON SCROLL */}
     <div className="max-h-[28rem] overflow-y-auto pr-2">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {citasPaginadas.map(c => (
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

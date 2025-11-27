
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiSettings, FiUser } from "react-icons/fi";
import HeaderMenu from "../components/HeaderMenu";

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="bg-light min-h-screen p-8">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 border-b border-gray-300 pb-4">

        <h1 className="text-4xl font-extrabold text-primary">
          ADMINISTRACIÓN
        </h1>

        {/* MENÚ HAMBURGUESA */}
        <div className="relative" ref={menuRef}>
          
          <HeaderMenu />

         
        </div>
      </header>

      {/* NAV SUPERIOR */}
      <nav className="flex gap-4 mb-6">
        <Link to="/expedientes" className="btn-accent shadow-md">
          Expedientes
        </Link>

        <Link to="/admin/services" className="btn-accent shadow-md">
          Servicios
        </Link>

        <Link to="/empleados" className="btn-accent shadow-md">
          Empleados
        </Link>

        <Link to="/facturas/historial" className="btn-accent shadow-md">
          Facturas
        </Link>

        <Link to="/reportes" className="btn-accent shadow-md">
          Reportes
        </Link>

        <Link to="/especialidades" className="btn-accent shadow-md">
          Especialidades
        </Link>
      </nav>


      {/* CONTENIDO PRINCIPAL - GRID EXACTO DEL MOCKUP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

  {/* Reportes citas canceladas/completadas */}
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-info">
    <h3 className="text-info text-2xl font-bold mb-4">Reportes de Citas</h3>
    <p className="text-primary opacity-80">Programadas</p>
    <p className="text-primary opacity-80 mb-1">Canceladas</p>
    <p className="text-primary opacity-80">Completadas</p>

  </div>

  {/* Sesiones de empleados */}
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-success">
    <h3 className="text-success text-2xl font-bold mb-4">Sesiones de Empleados</h3>
    <p className="text-primary opacity-80">Control de logins y actividad</p>
  </div>

  {/* Ganancias totales */}
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-primary">
    <h3 className="text-primary text-2xl font-bold mb-4">Ganancias Totales</h3>
    <p className="text-primary opacity-80">Día / Semana / Mes / Año</p>
  </div>

  {/* Historial factura */}
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-accent md:col-span-1">
    <h3 className="text-accent text-2xl font-bold mb-4">Historial de Facturas</h3>
    <p className="text-primary opacity-80">Últimos registros generados</p>
  </div>

</div>


    </div>
  );
}

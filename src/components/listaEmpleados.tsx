import { useState } from "react";
import type { EmpleadoResponse } from "../types/empleado";
import "../index.css";

type Props = {
  empleados: EmpleadoResponse[];
  filtro: string;
  onEditar: (empleado: EmpleadoResponse) => void;
};

export const ListaEmpleados = ({ empleados, filtro, onEditar }: Props) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [empleadosPorPagina, setEmpleadosPorPagina] = useState(5); // Selector dinámico

  // --- FILTRADO ---
  const empleadosFiltrados = empleados.filter((e) => {
    const q = filtro.trim().toLowerCase();
    if (!q) return true;

    return (
      e.persona.nombre.toLowerCase().includes(q) ||
      e.persona.apellido.toLowerCase().includes(q) ||
      e.persona.dni.toLowerCase().includes(q)
    );
  });

  // --- PAGINACIÓN ---
  const totalPaginas = Math.ceil(empleadosFiltrados.length / empleadosPorPagina);
  const indiceInicial = (paginaActual - 1) * empleadosPorPagina;
  const indiceFinal = indiceInicial + empleadosPorPagina;

  const empleadosPaginados = empleadosFiltrados.slice(indiceInicial, indiceFinal);

  const formatMoney = (n: number) => `L ${n}`;

  return (
    <>
      {/* TABLA */}
      <div className="bg-light border border-primary/10 max-h-96 overflow-y-auto shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary text-light text-sm font-semibold sticky top-0 uppercase">
            <tr>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Apellido</th>
              <th className="py-3 px-4">DNI</th>
              <th className="py-3 px-4">Teléfono</th>
              <th className="py-3 px-4">Puesto</th>
              <th className="py-3 px-4">Salario</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm text-primary">
            {empleadosPaginados.map((e) => (
              <tr
                key={e.id}
                className="border-t border-primary/10 hover:bg-accent/10 transition"
              >
                <td className="py-3 px-4">{e.persona.nombre}</td>
                <td className="py-3 px-4">{e.persona.apellido}</td>
                <td className="py-3 px-4">{e.persona.dni}</td>
                <td className="py-3 px-4">{e.persona.telefono}</td>
                <td className="py-3 px-4">{e.puesto}</td>
                <td className="py-3 px-4">{formatMoney(e.salario)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      e.activo
                        ? "bg-success/20 text-success"
                        : "bg-primary/20 text-primary/70"
                    }`}
                  >
                    {e.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onEditar(e)}
                    className="btn-accent text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm transition"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}

            {empleadosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-primary/60 text-sm"
                >
                  No se encontraron resultados...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SELECTOR DE ELEMENTOS POR PÁGINA */}
      <div className="flex items-center gap-3 mt-4 text-primary">
        <span className="text-sm">Elementos por página:</span>

        <select
          value={empleadosPorPagina}
          onChange={(e) => {
            setEmpleadosPorPagina(Number(e.target.value));
            setPaginaActual(1); // Reiniciar página
          }}
          className="border border-primary/20 rounded-lg px-2 py-1 bg-light text-primary focus:ring-2 focus:ring-info focus:border-info"
        >
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* PAGINADOR */}
      {empleadosFiltrados.length > empleadosPorPagina && (
        <div className="flex justify-center mt-4 gap-2">
          {/* Botón Anterior */}
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual((p) => p - 1)}
            className={`px-4 py-2 rounded-lg border transition ${
              paginaActual === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-light border-primary/20 hover:bg-primary/10 text-primary"
            }`}
          >
            Anterior
          </button>

          {/* Números */}
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPaginaActual(i + 1)}
              className={`px-4 py-2 rounded-lg border transition ${
                paginaActual === i + 1
                  ? "bg-info text-light border-info"
                  : "bg-light border-primary/20 hover:bg-primary/10 text-primary"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Botón Siguiente */}
          <button
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual((p) => p + 1)}
            className={`px-4 py-2 rounded-lg border transition ${
              paginaActual === totalPaginas
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-light border-primary/20 hover:bg-primary/10 text-primary"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  );
};

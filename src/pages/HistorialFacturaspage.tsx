// src/pages/HistorialFacturasPage.tsx
import { useEffect, useState } from "react";
import HeaderMenu from "../components/HeaderMenu";
import { FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function HistorialFacturasPage() {
  // ---------------------------
  // Estados principales
  // ---------------------------
  const [facturas, setFacturas] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Paginador
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  // ---------------------------
  // Mock temporal (simula backend)
  // ---------------------------
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const datosEjemplo = [
        {
          id: 1,
          numeroFactura: "000-001-01-00000001",
          paciente: { nombre: "Carlos", apellido: "López", dni: "0801190012345" },
          subtotal: 500,
          totalPagar: 575,
          fechaEmision: "2025-02-13T12:00:00",
        },
        {
          id: 2,
          numeroFactura: "000-001-01-00000002",
          paciente: { nombre: "Ana", apellido: "Martínez", dni: "0703198712345" },
          subtotal: 800,
          totalPagar: 920,
          fechaEmision: "2025-02-12T09:00:00",
        },
      ];

      setFacturas(datosEjemplo);
      setFiltered(datosEjemplo);
      setLoading(false);
    }, 800);
  }, []);

  // ---------------------------
  // Filtrado
  // ---------------------------
  const aplicarFiltros = () => {
    let result = [...facturas];

    // Buscar por número o cliente
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();

      result = result.filter((f) =>
        f.numeroFactura.toLowerCase().includes(q) ||
        `${f.paciente.nombre} ${f.paciente.apellido}`.toLowerCase().includes(q) ||
        f.paciente.dni.includes(q)
      );
    }

    // Filtrar por fecha
    if (fechaInicio) {
      result = result.filter(
        (f) => new Date(f.fechaEmision) >= new Date(fechaInicio)
      );
    }
    if (fechaFin) {
      result = result.filter(
        (f) => new Date(f.fechaEmision) <= new Date(fechaFin + "T23:59:59")
      );
    }

    setFiltered(result);
    setPagina(1);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, fechaInicio, fechaFin]);

  // ---------------------------
  // Paginación
  // ---------------------------
  const totalPaginas = Math.ceil(filtered.length / porPagina);
  const datosPagina = filtered.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="p-8 bg-light min-h-screen text-primary">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <button>
           <Link className="btn-primary w-32 flex items-center gap-1" to={"/dashboard"}>
              <FiChevronLeft />
              
              Regresar</Link>
      
        </button>
          
        <div className="items-center flex flex-col text-center">
      <h1 className="text-4xl font-bold mb-2 text-primary">
        Historial de Facturas
      </h1>
      <p className="text-primary/70 item">
       Consulta y seguimiento de facturas emitidas
      </p>
    </div>

        <HeaderMenu />
      </div>

      {/* FILTROS */}
      <div className="bg-white border border-primary/10 shadow-md rounded-xl p-6 mb-6">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buscar */}
          
          <div className="relative">
            <label className="text-sm text-primary/80">Busqueda</label>
           
            <input
              type="text"
              placeholder="Número de factura, cliente o DNI"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 py-2 border border-primary/20 rounded-lg bg-light focus:ring-info focus:border-info transition"
            />
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="text-sm text-primary/80">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-primary/20 rounded-lg"
            />
          </div>

          {/* Fecha fin */}
          <div>
            <label className="text-sm text-primary/80">Fecha fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-primary/20 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-primary/10 shadow-md rounded-xl p-6">
        {loading ? (
          <p className="text-primary/60">Cargando facturas...</p>
        ) : filtered.length === 0 ? (
          <p className="text-primary/60">No se encontraron facturas.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary text-light">
              <tr>
                <th className="py-3 px-4">Número</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">DNI</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Total</th>
              </tr>
            </thead>

            <tbody>
              {datosPagina.map((f) => (
                <tr key={f.id} className="border-t border-primary/10 hover:bg-accent/10 transition">
                  <td className="py-3 px-4">{f.numeroFactura}</td>
                  <td className="py-3 px-4">
                    {f.paciente.nombre} {f.paciente.apellido}
                  </td>
                  <td className="py-3 px-4">{f.paciente.dni}</td>
                  <td className="py-3 px-4">
                    {new Date(f.fechaEmision).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">L {f.subtotal.toFixed(2)}</td>
                  <td className="py-3 px-4 font-semibold">L {f.totalPagar.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINADOR */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            className={`btn-accent px-4 py-2 ${pagina === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            Anterior
          </button>

          <span className="px-4 py-2 text-primary/80">
            Página {pagina} de {totalPaginas}
          </span>

          <button
            className={`btn-accent px-4 py-2 ${pagina === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

// src/pages/HistorialFacturasPage.tsx
import { useEffect, useState, useRef } from "react";
import HeaderMenu from "../components/HeaderMenu";
import { FiChevronLeft, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

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

  // Debounce ref
  const debounceRef = useRef<number | null>(null);

  // ---------------------------
  // Cargar facturas desde backend
  // ---------------------------
  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/facturas/historial", headers);
        const data = res.data?.data ?? [];

        // Normalizar: asegurar que cada factura tenga paciente, doctor, detalles, fechaEmision, subtotal, totalPagar
        const normalized = data.map((f: any) => ({
          ...f,
          numeroFactura: f.numeroFactura ?? f.numero ?? String(f.id ?? ""),
          fechaEmision: f.fechaEmision ?? f.createdAt ?? null,
          subtotal: typeof f.subtotal === "number" ? f.subtotal : Number(f.subtotal ?? 0),
          totalPagar: typeof f.totalPagar === "number" ? f.totalPagar : Number(f.totalPagar ?? 0),
          paciente: f.paciente ?? { nombre: "", apellido: "", dni: "" },
          doctor: f.doctor?.persona ? { nombre: f.doctor.persona.nombre, apellido: f.doctor.persona.apellido } : (f.doctor ?? null),
        }));

        setFacturas(normalized);
        setFiltered(normalized);
      } catch (err) {
        console.error("Error cargando historial de facturas:", err);
        setFacturas([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  // ---------------------------
  // Filtrado
  // ---------------------------
  const aplicarFiltros = () => {
    let result = [...facturas];

    // Buscar (seguro: convertir a string antes de usar toLowerCase)
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();

      result = result.filter((f) => {
        const numero = String(f.numeroFactura ?? "").toLowerCase();
        const nombre = `${String(f.paciente?.nombre ?? "")} ${String(f.paciente?.apellido ?? "")}`.toLowerCase();
        const dni = String(f.paciente?.dni ?? "").toLowerCase();
        const doctorName = f.doctor ? `${String(f.doctor?.nombre ?? "")} ${String(f.doctor?.apellido ?? "")}`.toLowerCase() : "";
        // permitir buscar por fecha formateada también (opcional)
        const fecha = f.fechaEmision ? new Date(f.fechaEmision).toLocaleDateString().toLowerCase() : "";

        return (
          numero.includes(q) ||
          nombre.includes(q) ||
          dni.includes(q) ||
          doctorName.includes(q) ||
          fecha.includes(q)
        );
      });
    }

    // Filtro fechas (si el usuario definió alguna)
    if (fechaInicio) {
      result = result.filter((f) => {
        if (!f.fechaEmision) return false;
        return new Date(f.fechaEmision) >= new Date(fechaInicio);
      });
    }
    if (fechaFin) {
      result = result.filter((f) => {
        if (!f.fechaEmision) return false;
        return new Date(f.fechaEmision) <= new Date(fechaFin + "T23:59:59");
      });
    }

    setFiltered(result);
    setPagina(1);
  };

  // Llamar aplicarFiltros cuando cambian busqueda/fechas
  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaInicio, fechaFin]);

  // BÚSQUEDA EN VIVO: ejecutar aplicarFiltros mientras se escribe (debounce)
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    // debounce 300ms
    // @ts-ignore
    debounceRef.current = window.setTimeout(() => {
      aplicarFiltros();
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  // ---------------------------
  // Paginación
  // ---------------------------
  const totalPaginas = Math.ceil(filtered.length / porPagina);
  const datosPagina = filtered.slice((pagina - 1) * porPagina, pagina * porPagina);

  // ---------------------------
  // Botón PDF (solo listo)
  // ---------------------------
  const verPDF = (factura: any) => {
    console.log("PDF de factura:", factura.id);
    // window.open(`http://localhost:3000/factura/pdf/${factura.id}`, "_blank");
  };

  return (
    <div className="p-8 bg-light min-h-screen text-primary">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <button>
          <Link className="btn-primary w-32 flex items-center gap-1" to={"/dashboard"}>
            <FiChevronLeft />
            Regresar
          </Link>
        </button>

        <div className="items-center flex flex-col text-center">
          <h1 className="text-4xl font-bold mb-2 text-primary">Historial de Facturas</h1>
          <p className="text-primary/70">Consulta y seguimiento de facturas emitidas</p>
        </div>

        <HeaderMenu />
      </div>

      {/* FILTROS */}
      <div className="bg-white border border-primary/10 shadow-md rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Buscar */}
          <div>
            <label className="text-sm text-primary/80">Búsqueda</label>
            <input
              type="text"
              placeholder="Número, Cliente o DNI"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-3 py-2 pr-3 border border-primary/20 rounded-lg bg-light"
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
                <tr
                  key={f.id}
                  className="border-t border-primary/10 hover:bg-accent/10 transition"
                >
                  <td className="py-3 px-4">{f.numeroFactura}</td>
                  <td className="py-3 px-4">
                    {String(f.paciente?.nombre ?? "")} {String(f.paciente?.apellido ?? "")}
                  </td>
                  <td className="py-3 px-4">{String(f.paciente?.dni ?? "")}</td>
                  <td className="py-3 px-4">
                    {f.fechaEmision ? new Date(f.fechaEmision).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 px-4">L {Number(f.subtotal ?? 0).toFixed(2)}</td>
                  <td className="py-3 px-4 font-semibold">L {Number(f.totalPagar ?? 0).toFixed(2)}</td>

                  
                  
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
            className={`btn-accent px-4 py-2 ${
              pagina === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            Anterior
          </button>

          <span className="px-4 py-2 text-primary/80">
            Página {pagina} de {totalPaginas}
          </span>

          <button
            className={`btn-accent px-4 py-2 ${
              pagina === totalPaginas ? "opacity-50 cursor-not-allowed" : ""
            }`}
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

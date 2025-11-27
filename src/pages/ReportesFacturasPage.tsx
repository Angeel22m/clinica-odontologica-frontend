// src/pages/ReporteFacturacionPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import HeaderMenu from "../components/HeaderMenu";
import { Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import axios from "axios";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

type Factura = {
  id: number;
  numeroFactura: string;
  paciente: { nombre: string; apellido: string; id?: number };
  doctor: { nombre: string; apellido: string; id?: number } | null;
  servicio: string;
  totalPagar: number;
  isv15: number;
  isv18: number;
  fechaEmision: string;
};

export default function ReporteFacturacionPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [filtered, setFiltered] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [cliente, setCliente] = useState("");
  const [doctor, setDoctor] = useState<{ id?: number; label: string } | null>(null);
  const [servicio, setServicio] = useState<{ id?: number; label: string } | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [tipoImpuesto, setTipoImpuesto] = useState("");

  const [quickRange, setQuickRange] = useState("general");

  const [doctores, setDoctores] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [docQuery, setDocQuery] = useState("");
  const [servQuery, setServQuery] = useState("");
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [servDropdownOpen, setServDropdownOpen] = useState(false);

  const docWrapRef = useRef<HTMLDivElement | null>(null);
  const servWrapRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ---------- CARGAR FACTURAS DESDE BACKEND ----------
  useEffect(() => {
    const fetchFacturas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/facturas/historial`, headers);
        const data = res.data?.data ?? [];

        const mapped: Factura[] = data.map((f: any) => ({
          id: f.id,
          numeroFactura: f.numeroFactura,
          paciente: {
            nombre: f.paciente?.nombre ?? "N/A",
            apellido: f.paciente?.apellido ?? "",
            id: f.paciente?.id,
          },
          doctor: f.doctor
            ? {
                nombre: f.doctor?.persona?.nombre ?? "",
                apellido: f.doctor?.persona?.apellido ?? "",
                id: f.doctor?.id,
              }
            : null,
          servicio: f.detalles?.[0]?.descripcion ?? "Servicio no especificado",
          totalPagar: f.totalPagar,
          isv15: f.isv15,
          isv18: f.isv18,
          fechaEmision: f.fechaEmision,
        }));

        setFacturas(mapped);
        setFiltered(mapped);
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
      setLoading(false);
    };

    fetchFacturas();
  }, []);

  // ---------- DOCTORES ----------
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const res = await axios.get("http://localhost:3000/empleado", headers);
        const data = res.data?.data ?? [];
        const docs = Array.isArray(data)
          ? data.filter((d: any) => d.puesto === "DOCTOR")
          : [];
        const mapped = docs.map((d: any) => ({
          id: d.personaId ?? d.id,
          label: `${d.persona?.nombre ?? ""} ${d.persona?.apellido ?? ""}`.trim(),
        }));
        setDoctores(mapped);
      } catch (err) {
        console.error("Error doctores:", err);
      }
    };
    fetchEmpleados();
  }, []);

  // ---------- SERVICIOS ----------
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get("http://localhost:3000/servicios", headers);
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setServicios(
          data
            .filter((s: any) => s.activo === true || s.activo === "activo")
            .map((s: any) => ({ id: s.id, label: s.nombre }))
        );
      } catch (err) {
        console.error("Error servicios:", err);
      }
    };
    fetchServicios();
  }, []);

  // ---------- CLICK OUTSIDE DROPDOWNS ----------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (docWrapRef.current && !docWrapRef.current.contains(e.target as Node)) {
        if (!doctor) setDocQuery("");
        setDocDropdownOpen(false);
      }
      if (servWrapRef.current && !servWrapRef.current.contains(e.target as Node)) {
        if (!servicio) setServQuery("");
        setServDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [doctor, servicio]);

  // ---------- FILTROS PRINCIPALES ----------
  const aplicarFiltros = () => {
    let result = [...facturas];

    if (cliente.trim()) {
      const q = cliente.toLowerCase();
      result = result.filter((f) =>
        `${f.paciente.nombre} ${f.paciente.apellido}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (doctor) {
      const q = doctor.label.toLowerCase();
      result = result.filter(
        (f) =>
          f.doctor &&
          `${f.doctor.nombre} ${f.doctor.apellido}`
            .toLowerCase()
            .includes(q)
      );
    }

    if (servicio) {
      const q = servicio.label.toLowerCase();
      result = result.filter((f) => f.servicio.toLowerCase().includes(q));
    }

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

    if (minTotal) result = result.filter((f) => f.totalPagar >= Number(minTotal));
    if (maxTotal) result = result.filter((f) => f.totalPagar <= Number(maxTotal));

    if (tipoImpuesto === "15") result = result.filter((f) => f.isv15 > 0);
    if (tipoImpuesto === "18") result = result.filter((f) => f.isv18 > 0);
    if (tipoImpuesto === "exento")
      result = result.filter((f) => f.isv15 === 0 && f.isv18 === 0);

    setFiltered(result);
    setPage(1);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [
    cliente,
    doctor,
    servicio,
    fechaInicio,
    fechaFin,
    minTotal,
    maxTotal,
    tipoImpuesto,
    facturas,
  ]);

  // ---------- QUICK RANGES ----------
  useEffect(() => {
    const hoy = new Date();
    const Y = hoy.getFullYear();
    const M = hoy.getMonth();
    const D = hoy.getDate();

    const startOfToday = new Date(Y, M, D);
    let start: Date | null = null;
    let end: Date | null = null;

    switch (quickRange) {
      case "hoy":
        start = startOfToday;
        end = startOfToday;
        break;
      case "semana":
        start = startOfToday;
        end = new Date(start.getTime() + 6 * 86400000);
        break;
      case "mes":
        start = new Date(Y, M, 1);
        end = new Date(Y, M + 1, 0);
        break;
      case "año":
        start = new Date(Y, 0, 1);
        end = new Date(Y, 11, 31);
        break;
      case "general":
        start = null;
        end = null;
        break;
      case "personalizado":
        start = fechaInicio ? new Date(fechaInicio) : null;
        end = fechaFin ? new Date(fechaFin) : null;
        break;
    }

    if (start && end) {
      const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;

      setFechaInicio(fmt(start));
      setFechaFin(fmt(end));
    } else if (quickRange === "general") {
      setFechaInicio("");
      setFechaFin("");
    }
  }, [quickRange]);

  const totalIngresos = filtered.reduce((a, b) => a + b.totalPagar, 0);
  const totalImpuestos = filtered.reduce(
    (a, b) => a + b.isv15 + b.isv18,
    0
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const formatoFecha = (d: string) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="p-8 bg-light min-h-screen text-primary">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <Link className="btn-primary w-32 flex items-center gap-1" to={"/dashboard"}>
          <FiChevronLeft />
          Regresar
        </Link>

        <div className="items-center flex flex-col text-center">
          <h1 className="text-4xl font-bold mb-2">Reportes de Facturación</h1>
          <p className="text-primary/70">
            Análisis y métricas de ingresos del sistema
          </p>
        </div>

        <HeaderMenu />
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md border border-primary/10 p-6 rounded-xl">
          <p className="text-primary/70">Total Facturado</p>
          <h2 className="text-3xl font-bold text-primary">
            L {totalIngresos.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white shadow-md border border-primary/10 p-6 rounded-xl">
          <p className="text-primary/70">Impuestos Totales</p>
          <h2 className="text-3xl font-bold text-primary">
            L {totalImpuestos.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white shadow-md border border-primary/10 p-6 rounded-xl">
          <p className="text-primary/70">Facturas Encontradas</p>
          <h2 className="text-3xl font-bold text-primary">{filtered.length}</h2>
        </div>
      </div>

      {/* CONTROL FILTROS */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-accent px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Filter size={16} /> {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm">Filas por página:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* FILTROS */}
      {showFilters && (
        <div className="bg-white border border-primary/10 shadow-md rounded-xl p-6 mb-6">

          {/* Quick Ranges */}
          <div className="mb-4 flex flex-wrap gap-3 items-center">
            <label className="text-sm font-medium mr-2">Rango rápido:</label>
            <div className="flex items-center gap-3">
              {["general", "hoy", "semana", "mes", "año", "personalizado"].map(
                (r) => (
                  <label key={r} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={quickRange === r}
                      onChange={() => setQuickRange(r)}
                    />
                    {r === "general"
                      ? "General"
                      : r === "hoy"
                      ? "Hoy"
                      : r === "semana"
                      ? "Esta semana"
                      : r === "mes"
                      ? "Este mes"
                      : r === "año"
                      ? "Este año"
                      : "Personalizado"}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Cliente */}
            <input
              type="text"
              placeholder="Cliente (nombre o apellido)"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="p-3 border border-primary/20 rounded-lg"
            />

            {/* Doctor Autocomplete */}
            <div ref={docWrapRef} className="relative">
              <input
                type="text"
                placeholder="Doctor (escriba para buscar)"
                value={doctor ? doctor.label : docQuery}
                onChange={(e) => {
                  setDocQuery(e.target.value);
                  setDoctor(null);
                  setDocDropdownOpen(true);
                }}
                onFocus={() => setDocDropdownOpen(true)}
                className="p-3 border border-primary/20 rounded-lg w-full bg-white"
              />

              {docDropdownOpen && (
                <div className="absolute z-40 bg-light border border-primary/10 rounded shadow max-h-48 overflow-y-auto w-full mt-1">
                  {doctores
                    .filter((d) =>
                      d.label.toLowerCase().includes((docQuery || "").toLowerCase())
                    )
                    .slice(0, 30)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-primary"
                        onMouseDown={() => {
                          setDoctor({ id: d.id, label: d.label });
                          setDocQuery("");
                          setDocDropdownOpen(false);
                        }}
                      >
                        {d.label}
                      </div>
                    ))}

                  {doctores.filter((d) =>
                    d.label.toLowerCase().includes((docQuery || "").toLowerCase())
                  ).length === 0 && (
                    <div className="px-3 py-2 text-primary/60">
                      No hay coincidencias
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Servicio Autocomplete */}
            <div ref={servWrapRef} className="relative">
              <input
                type="text"
                placeholder="Servicio (escriba para buscar)"
                value={servicio ? servicio.label : servQuery}
                onChange={(e) => {
                  setServQuery(e.target.value);
                  setServicio(null);
                  setServDropdownOpen(true);
                }}
                onFocus={() => setServDropdownOpen(true)}
                className="p-3 bg-light border border-primary/20 rounded-lg w-full"
              />

              {servDropdownOpen && (
                <div className="absolute z-40 bg-light border border-primary/10 rounded shadow max-h-48 overflow-y-auto w-full mt-1">
                  {servicios
                    .filter((s) =>
                      s.label.toLowerCase().includes((servQuery || "").toLowerCase())
                    )
                    .slice(0, 50)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-primary"
                        onMouseDown={() => {
                          setServicio({ id: s.id, label: s.label });
                          setServQuery("");
                          setServDropdownOpen(false);
                        }}
                      >
                        {s.label}
                      </div>
                    ))}

                  {servicios.filter((s) =>
                    s.label.toLowerCase().includes((servQuery || "").toLowerCase())
                  ).length === 0 && (
                    <div className="px-3 py-2 text-primary/60">
                      No hay coincidencias
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tipo de impuesto */}
            <select
              value={tipoImpuesto}
              onChange={(e) => setTipoImpuesto(e.target.value)}
              className="p-3 border border-primary/20 rounded-lg"
            >
              <option value="">Tipo de impuesto</option>
              <option value="15">ISV 15%</option>
              <option value="18">ISV 18%</option>
              <option value="exento">Exento / Exonerado</option>
            </select>

            {/* Fechas */}
            {(quickRange !== "general" || quickRange === "personalizado") && (
              <div>
                <label className="text-sm">Fecha inicio</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="p-3 border border-primary/20 rounded-lg w-full"
                />
              </div>
            )}

            {(quickRange !== "general" || quickRange === "personalizado") && (
              <div>
                <label className="text-sm">Fecha fin</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="p-3 border border-primary/20 rounded-lg w-full"
                />
              </div>
            )}

            {/* Rango min - max */}
            <input
              type="number"
              placeholder="Monto mínimo"
              value={minTotal}
              onChange={(e) => setMinTotal(e.target.value)}
              className="p-3 border border-primary/20 rounded-lg"
            />
            <input
              type="number"
              placeholder="Monto máximo"
              value={maxTotal}
              onChange={(e) => setMaxTotal(e.target.value)}
              className="p-3 border border-primary/20 rounded-lg"
            />

            {/* Botones */}
            <div className="md:col-span-4 flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowFilters(false)}
                className="btn-accent px-4 py-2 rounded-lg"
              >
                Aplicar
              </button>

              <button
                onClick={() => {
                  setCliente("");
                  setDoctor(null);
                  setServicio(null);
                  setFechaInicio("");
                  setFechaFin("");
                  setMinTotal("");
                  setMaxTotal("");
                  setTipoImpuesto("");
                  setQuickRange("general");
                }}
                className="btn-primary px-4 py-2 rounded-lg"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLA */}
      <div className="bg-white border border-primary/10 shadow-md rounded-xl p-6">
        {loading ? (
          <p>Cargando...</p>
        ) : filtered.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary text-light">
                <tr>
                  <th className="py-3 px-4">Factura</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Servicio</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((f) => (
                  <tr
                    key={f.id}
                    className="border-t border-primary/10 hover:bg-accent/10 transition"
                  >
                    <td className="py-3 px-4">{f.numeroFactura}</td>
                    <td className="py-3 px-4">
                      {f.paciente.nombre} {f.paciente.apellido}
                    </td>
                    <td className="py-3 px-4">
                      {f.doctor
                        ? `${f.doctor.nombre} ${f.doctor.apellido}`
                        : "-"}
                    </td>
                    <td className="py-3 px-4">{f.servicio}</td>
                    <td className="py-3 px-4">{formatoFecha(f.fechaEmision)}</td>
                    <td className="py-3 px-4 font-semibold text-right">
                      L {f.totalPagar.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINACION */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-primary/70">
                Mostrando {Math.min((page - 1) * pageSize + 1, filtered.length)} -{" "}
                {Math.min(page * pageSize, filtered.length)} de {filtered.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <div className="px-3 py-1 border rounded">
                  {page} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

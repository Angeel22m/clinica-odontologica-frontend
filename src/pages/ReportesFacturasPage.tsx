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

type FacturaMock = {
  id: number;
  numeroFactura: string;
  paciente: { nombre: string; apellido: string; id?: number };
  doctor: { nombre: string; apellido: string; id?: number } | null;
  servicio: string;
  totalPagar: number;
  isv15: number;
  isv18: number;
  fechaEmision: string; // YYYY-MM-DD
};

export default function ReporteFacturacionPage() {
  // -------------------------
  // Estados principales
  // -------------------------
  const [facturas, setFacturas] = useState<FacturaMock[]>([]);
  const [filtered, setFiltered] = useState<FacturaMock[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros visibles / colapsados
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [cliente, setCliente] = useState("");
  const [doctor, setDoctor] = useState<{ id?: number; label: string } | null>(
    null
  );
  const [servicio, setServicio] = useState<{ id?: number; label: string } | null>(
    null
  );
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [tipoImpuesto, setTipoImpuesto] = useState("");

  // Quick filter option
  const [quickRange, setQuickRange] = useState<
    "general" | "hoy" | "semana" | "mes" | "año" | "personalizado"
  >("general");

  // Autocomplete lists
  const [doctores, setDoctores] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [docQuery, setDocQuery] = useState("");
  const [servQuery, setServQuery] = useState("");
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [servDropdownOpen, setServDropdownOpen] = useState(false);

  // Refs for closing dropdowns on outside click
  const docWrapRef = useRef<HTMLDivElement | null>(null);
  const servWrapRef = useRef<HTMLDivElement | null>(null);

  // Paginacion
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // -------------------------
  // Mock temporal (15 facturas)
  // -------------------------
  useEffect(() => {
    // 15 ejemplos variados
    const mock: FacturaMock[] = [
      { id: 1, numeroFactura: "000-001-001-0000456", paciente: { nombre: "Carlos", apellido: "Murillo", id: 22 }, doctor: { nombre: "Miguel", apellido: "Santos", id: 2 }, servicio: "Ultrasonido", totalPagar: 1200, isv15: 180, isv18: 0, fechaEmision: "2025-01-12" },
      { id: 2, numeroFactura: "000-001-001-0000457", paciente: { nombre: "Ana", apellido: "Martínez", id: 23 }, doctor: { nombre: "Elena", apellido: "Suarez", id: 5 }, servicio: "Consulta General", totalPagar: 500, isv15: 0, isv18: 0, fechaEmision: "2025-02-01" },
      { id: 3, numeroFactura: "000-001-001-0000458", paciente: { nombre: "Luis", apellido: "González", id: 30 }, doctor: { nombre: "Miguel", apellido: "Santos", id: 2 }, servicio: "Rayos X", totalPagar: 700, isv15: 105, isv18: 0, fechaEmision: "2025-02-10" },
      { id: 4, numeroFactura: "000-001-001-0000459", paciente: { nombre: "María", apellido: "Lopez", id: 31 }, doctor: { nombre: "Elena", apellido: "Suarez", id: 5 }, servicio: "Laboratorio", totalPagar: 350, isv15: 52.5, isv18: 0, fechaEmision: "2025-02-15" },
      { id: 5, numeroFactura: "000-001-001-0000460", paciente: { nombre: "Pedro", apellido: "Hernández", id: 32 }, doctor: null, servicio: "Vacunación", totalPagar: 200, isv15: 30, isv18: 0, fechaEmision: "2025-03-01" },
      { id: 6, numeroFactura: "000-001-001-0000461", paciente: { nombre: "Sofia", apellido: "García", id: 33 }, doctor: { nombre: "Miguel", apellido: "Santos", id: 2 }, servicio: "Consulta Pediatría", totalPagar: 650, isv15: 97.5, isv18: 0, fechaEmision: "2025-03-12" },
      { id: 7, numeroFactura: "000-001-001-0000462", paciente: { nombre: "Jorge", apellido: "Ramos", id: 34 }, doctor: { nombre: "Roberto", apellido: "Martinez", id: 4 }, servicio: "Cirugía menor", totalPagar: 5000, isv15: 750, isv18: 0, fechaEmision: "2025-04-05" },
      { id: 8, numeroFactura: "000-001-001-0000463", paciente: { nombre: "Laura", apellido: "Ortiz", id: 35 }, doctor: null, servicio: "Terapia Física", totalPagar: 900, isv15: 135, isv18: 0, fechaEmision: "2025-04-20" },
      { id: 9, numeroFactura: "000-001-001-0000464", paciente: { nombre: "Diego", apellido: "Pérez", id: 36 }, doctor: { nombre: "Miguel", apellido: "Santos", id: 2 }, servicio: "Electrocardiograma", totalPagar: 400, isv15: 60, isv18: 0, fechaEmision: "2025-05-02" },
      { id: 10, numeroFactura: "000-001-001-0000465", paciente: { nombre: "Rosa", apellido: "Castillo", id: 37 }, doctor: { nombre: "Elena", apellido: "Suarez", id: 5 }, servicio: "Consulta Ginecológica", totalPagar: 800, isv15: 120, isv18: 0, fechaEmision: "2025-05-18" },
      { id: 11, numeroFactura: "000-001-001-0000466", paciente: { nombre: "Fernando", apellido: "Vega", id: 38 }, doctor: null, servicio: "Odontología", totalPagar: 950, isv15: 142.5, isv18: 0, fechaEmision: "2025-06-03" },
      { id: 12, numeroFactura: "000-001-001-0000467", paciente: { nombre: "Patricia", apellido: "Núñez", id: 39 }, doctor: { nombre: "Roberto", apellido: "Martinez", id: 4 }, servicio: "Cirugía mayor", totalPagar: 15000, isv15: 2250, isv18: 0, fechaEmision: "2025-06-12" },
      { id: 13, numeroFactura: "000-001-001-0000468", paciente: { nombre: "Andrea", apellido: "Mora", id: 40 }, doctor: { nombre: "Miguel", apellido: "Santos", id: 2 }, servicio: "Consulta General", totalPagar: 450, isv15: 67.5, isv18: 0, fechaEmision: "2025-07-01" },
      { id: 14, numeroFactura: "000-001-001-0000469", paciente: { nombre: "Camilo", apellido: "Rojas", id: 41 }, doctor: null, servicio: "Ecografía", totalPagar: 1100, isv15: 165, isv18: 0, fechaEmision: "2025-07-20" },
      { id: 15, numeroFactura: "000-001-001-0000470", paciente: { nombre: "Gloria", apellido: "Vásquez", id: 42 }, doctor: { nombre: "Elena", apellido: "Suarez", id: 5 }, servicio: "Consulta Dermatología", totalPagar: 600, isv15: 90, isv18: 0, fechaEmision: "2025-08-02" },
    ];

    setFacturas(mock);
    setFiltered(mock);
  }, []);

  // -------------------------
  // Cargar doctores y servicios (para selects)
  // -------------------------
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const res = await axios.get("http://localhost:3000/empleado", headers);
        const data = res.data?.data ?? [];
        // filtrar doctores
        const docs = Array.isArray(data) ? data.filter((d: any) => d.puesto === "DOCTOR") : [];
        const mapped = docs.map((d: any) => ({
          id: d.personaId ?? d.id,
          label: `${d.persona?.nombre ?? ""} ${d.persona?.apellido ?? ""}`.trim(),
          raw: d,
        }));
        setDoctores(mapped);
      } catch (err) {
        console.error("Error al cargar empleados:", err);
      }
    };
    fetchEmpleados();
  }, []);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get("http://localhost:3000/servicios", headers);
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
        setServicios(data.filter((s: any) => s.activo === true || s.activo === "activo").map((s: any) => ({ id: s.id, label: s.nombre, raw: s })));
      } catch (err) {
        console.error("Error al cargar servicios:", err);
      }
    };
    fetchServicios();
  }, []);

  // -------------------------
  // Manejo clic fuera para dropdowns
  // -------------------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (docWrapRef.current && !docWrapRef.current.contains(e.target as Node)) {
        // si no se seleccionó doctor, limpiar query
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

  // -------------------------
  // Filtrado general
  // -------------------------
  const aplicarFiltros = () => {
    setLoading(true);
    let result = [...facturas];

    // CLIENTE
    if (cliente.trim()) {
      const q = cliente.toLowerCase();
      result = result.filter((f) =>
        `${f.paciente.nombre} ${f.paciente.apellido}`.toLowerCase().includes(q)
      );
    }

    // DOCTOR (por label)
    if (doctor) {
      const q = doctor.label.toLowerCase();
      result = result.filter((f) => f.doctor && `${f.doctor.nombre} ${f.doctor.apellido}`.toLowerCase().includes(q));
    }

    // SERVICIO
    if (servicio) {
      const q = servicio.label.toLowerCase();
      result = result.filter((f) => f.servicio.toLowerCase().includes(q));
    }

    // FECHAS
    if (fechaInicio) {
      result = result.filter((f) => new Date(f.fechaEmision) >= new Date(fechaInicio));
    }
    if (fechaFin) {
      result = result.filter((f) => new Date(f.fechaEmision) <= new Date(fechaFin + "T23:59:59"));
    }

    // RANGOS DE TOTAL
    if (minTotal) {
      result = result.filter((f) => f.totalPagar >= Number(minTotal));
    }
    if (maxTotal) {
      result = result.filter((f) => f.totalPagar <= Number(maxTotal));
    }

    // TIPO DE IMPUESTO
    if (tipoImpuesto) {
      if (tipoImpuesto === "15") {
        result = result.filter((f) => f.isv15 > 0);
      }
      if (tipoImpuesto === "18") {
        result = result.filter((f) => f.isv18 > 0);
      }
      if (tipoImpuesto === "exento") {
        result = result.filter((f) => f.isv15 === 0 && f.isv18 === 0);
      }
    }

    setFiltered(result);
    setPage(1); // reset page
    setLoading(false);
  };

  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente, doctor, servicio, fechaInicio, fechaFin, minTotal, maxTotal, tipoImpuesto, facturas]);

  // -------------------------
  // Quick ranges (hoy, semana, mes, año, personalizado)
  // -------------------------
  useEffect(() => {
    const hoy = new Date();
    const startOfToday = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    let start: Date | null = null;
    let end: Date | null = null;

    switch (quickRange) {
      case "hoy":
        start = startOfToday;
        end = startOfToday;
        break;
      case "semana":
        start = startOfToday;
        end = new Date(startOfToday.getTime() + 6 * 24 * 60 * 60 * 1000); // 7 días (hoy +6)
        break;
      case "mes":
        start = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        end = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        break;
      case "año":
        start = new Date(hoy.getFullYear(), 0, 1);
        end = new Date(hoy.getFullYear(), 11, 31);
        break;
      case "general":
        start = null;
        end = null;
        break;
      case "personalizado":
        // no tocar las fechas (el usuario sólo las selecciona manual)
        start = fechaInicio ? new Date(fechaInicio) : null;
        end = fechaFin ? new Date(fechaFin) : null;
        break;
    }

    if (start && end) {
      // set fechas en formato YYYY-MM-DD
      const toYMD = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      setFechaInicio(toYMD(start));
      setFechaFin(toYMD(end));
    } else if (quickRange === "general") {
      setFechaInicio("");
      setFechaFin("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickRange]);

  // -------------------------
  // Métricas rápidas
  // -------------------------
  const totalIngresos = filtered.reduce((a, b) => a + b.totalPagar, 0);
  const totalImpuestos = filtered.reduce((a, b) => a + b.isv15 + b.isv18, 0);

  // -------------------------
  // Paginacion calculada
  // -------------------------
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  

  // -------------------------
  // Utilidades
  // -------------------------
  const formatoFecha = (d: string) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  // -------------------------
  // Render
  // -------------------------
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
          <p className="text-primary/70">Análisis y métricas de ingresos del sistema</p>
        </div>

        <HeaderMenu />
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md border border-primary/10 p-6 rounded-xl">
          <p className="text-primary/70">Total Facturado</p>
          <h2 className="text-3xl font-bold text-primary">L {totalIngresos.toFixed(2)}</h2>
        </div>

        <div className="bg-white shadow-md border border-primary/10 p-6 rounded-xl">
          <p className="text-primary/70">Impuestos Totales</p>
          <h2 className="text-3xl font-bold text-primary">L {totalImpuestos.toFixed(2)}</h2>
        </div>

        <div className="bg-white shadow-md border border-primary/10 p-6 rounded-xl">
          <p className="text-primary/70">Facturas Encontradas</p>
          <h2 className="text-3xl font-bold text-primary">{filtered.length}</h2>
        </div>
      </div>

      {/* CONTROLES FILTROS Y ACCIONES */}
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

      {/* FILTROS COLLAPSABLE */}
      {showFilters && (
        <div className="bg-white border border-primary/10 shadow-md rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>

          {/* Quick ranges */}
          <div className="mb-4 flex flex-wrap gap-3 items-center">
            <label className="text-sm font-medium mr-2">Rango rápido:</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input type="radio" checked={quickRange === "general"} onChange={() => setQuickRange("general")} />
                General
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={quickRange === "hoy"} onChange={() => setQuickRange("hoy")} />
                Hoy
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={quickRange === "semana"} onChange={() => setQuickRange("semana")} />
                Esta semana
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={quickRange === "mes"} onChange={() => setQuickRange("mes")} />
                Este mes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={quickRange === "año"} onChange={() => setQuickRange("año")} />
                Este año
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={quickRange === "personalizado"} onChange={() => setQuickRange("personalizado")} />
                Personalizado
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Cliente simple */}
            <input
              type="text"
              placeholder="Cliente (nombre o apellido)"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="p-3 border border-primary/20 rounded-lg"
            />

            {/* Doctor - autocomplete */}
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
                <div className="absolute z-40 bg-white border border-primary/10 rounded shadow max-h-48 overflow-y-auto w-full mt-1">
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
                  {doctores.filter((d) => d.label.toLowerCase().includes((docQuery || "").toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-primary/60">No hay coincidencias</div>
                  )}
                </div>
              )}
            </div>

            {/* Servicio - autocomplete */}
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
                className="p-3 border border-primary/20 rounded-lg w-full bg-white"
              />
              {servDropdownOpen && (
                <div className="absolute z-40 bg-white border border-primary/10 rounded shadow max-h-48 overflow-y-auto w-full mt-1">
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
                  {servicios.filter((s) => s.label.toLowerCase().includes((servQuery || "").toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-primary/60">No hay coincidencias</div>
                  )}
                </div>
              )}
            </div>

            {/* Tipo impuesto */}
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

            {/* Fecha inicio (solo si personalizado o quickRange no general) */}
            {(quickRange === "personalizado" || quickRange !== "general") && (
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

            {(quickRange === "personalizado" || quickRange !== "general") && (
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

            {/* Rango total */}
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

            {/* Espacio para botón aplicar / limpiar */}
            <div className="md:col-span-4 flex gap-3 justify-end mt-2">
              <button
                onClick={() => {
                  // aplicarFiltros será ejecutado por useEffect al cambiar los estados
                  // ocultar filtros después de aplicar
                  setShowFilters(false);
                }}
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
                      {f.doctor ? `${f.doctor.nombre} ${f.doctor.apellido}` : "-"}
                    </td>
                    <td className="py-3 px-4">{f.servicio}</td>
                    <td className="py-3 px-4">{formatoFecha(f.fechaEmision)}</td>
                    <td className="py-3 px-4 font-semibold text-right">L {f.totalPagar.toFixed(2)}</td>
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

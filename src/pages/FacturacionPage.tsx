import { useState, useEffect } from "react";
import HeaderMenu from "../components/HeaderMenu";
import { FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import modificarInfoService from "../services/modificarInfoService";
import axios from "axios";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";

type SearchType = "correo" | "dni" | "telefono";

// Configuración de encabezados con token de autorización
const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};
// Reglas de detección para determinar el tipo de búsqueda
const detectionRules = [
  { type: "dni" as const, regex: /^\d{12,15}$/, errorMessage: "El DNI o Teléfono es incorrecto." },
  { type: "telefono" as const, regex: /^\d{7,11}$/, errorMessage: "El Teléfono es incorrecto." },
  { type: "correo" as const, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMessage: "Formato de correo inválido." },
];
// Función para determinar el tipo de búsqueda basado en la entrada del usuario
const determineSearchType = (value: string): SearchType | null => {
  if (detectionRules[2].regex.test(value)) return "correo";
  if (/^\d+$/.test(value)) {
    if (detectionRules[0].regex.test(value)) return "dni";
    if (detectionRules[1].regex.test(value)) return "telefono";
  }
  return null;
};
// Componente principal de la página de facturación
export default function FacturaPage() {
  const [paciente, setPaciente] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<string>("N/A");
  const [ultimaCita, setUltimaCita] = useState<any | null>(null);
  const [serviciosFactura, setServiciosFactura] = useState<any[]>([]);
  const [totalesPreview, setTotalesPreview] = useState<{ subtotal: number; isv15: number; total: number } | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [notification, setNotification] = useState<{ msg: string; type: "success" | "alert" | "info" } | null>(null);

  const showNotification = (msg: string, type: "success" | "alert" | "info" = "info") => {
    setNotification({ msg, type });
  };

const showApiError = (err: any) => {
  const data = err?.data;

  if (!data) {
    showNotification("Error desconocido.", "alert");
    return;
  }

  if (typeof data === "string") {
    showNotification(data, "alert");
    return;
  }

  if (data.message) {
    showNotification(data.message, "alert");
    return;
  }

  if (data.error) {
    showNotification(data.error, "alert");
    return;
  }

  if (data.msg) {
    showNotification(data.msg, "alert");
    return;
  }

  if (data.detail) {
    showNotification(data.detail, "alert");
    return;
  }

  showNotification("Error inesperado.", "alert");
};


  const normalizePacienteResponse = (resp: any) => {
    let raw: any = resp;

    if (resp?.data && (resp.data?.data || resp.data?.persona)) {
      raw = resp.data?.data ?? resp.data;
    } else if (resp?.data && typeof resp.data === "object" && !resp.data.data) {
      raw = resp.data;
    }

    const persona = raw?.persona ?? raw;
    const userId = raw?.id ?? persona?.id ?? persona?.personaId ?? null;

    return {
      id: userId,
      correo: raw?.correo ?? persona?.user?.correo ?? persona?.correo,
      nombre: persona?.nombre ?? raw?.nombre,
      apellido: persona?.apellido ?? raw?.apellido,
      dni: persona?.dni ?? raw?.dni,
      telefono: persona?.telefono ?? raw?.telefono,
      direccion: persona?.direccion ?? raw?.direccion,
      fechaNac: persona?.fechaNac ?? raw?.fechaNac,
      rawFull: raw,
    };
  };

  const cargarPaciente = async (value: string, type: SearchType) => {
    setLoading(true);
    setPaciente(null);
    setUltimaCita(null);
    setServiciosFactura([]);
    setTotalesPreview(null);

    try {
      let resp: any;

      switch (type) {
        case "correo":
          resp = await modificarInfoService.buscarPorCorreo(value);
          break;
        case "dni":
          resp = await modificarInfoService.buscarPorDni(value);
          break;
        case "telefono":
          resp = await modificarInfoService.buscarPorTelefono(value);
          break;
      }

      const normalized = normalizePacienteResponse(resp);
      setPaciente(normalized);

      const pacienteId = normalized.id;
      if (!pacienteId) {
        showNotification("No se pudo obtener pacienteId desde la respuesta.", "alert");
        return;
      }

      try {
        const citasResp = await axios.get(`http://localhost:3000/factura/Citas?pacienteId=${pacienteId}`, headers);

        if (typeof citasResp?.data === "string") showNotification(citasResp.data, "info");
        if (citasResp?.data?.message) showNotification(citasResp.data.message, "info");

        if (Array.isArray(citasResp.data) && citasResp.data.length > 0) {
          const cita = citasResp.data[citasResp.data.length - 1];
          setUltimaCita(cita);
          await fetchPreview(cita.id);
        } else if (citasResp.data?.cita) {
          setUltimaCita(citasResp.data.cita);
          await fetchPreview(citasResp.data.cita.id);
        } else {
          showNotification("No se encontraron citas para facturar.", "info");
        }
      } catch (err: any) {
        showApiError(err);
      }
    } catch (error: any) {
      showApiError(error);
      const status = error?.response?.status ?? error?.status;
      if (status === 404) setPaciente({ notFound: true });
      else setPaciente({ error: true, message: error?.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async (citaId: number) => {
    try {
      const previewResp = await axios.get(`http://localhost:3000/factura/preview?citaId=${citaId}`, headers);
      const data = previewResp.data;

      if(data?.nombreDoctor){
        setDoctor(
          data.nombreDoctor
        )

      }
      else{
        setDoctor("N/A")
      }

      if (data?.servicio) {
        setServiciosFactura([
          {
           
            nombre: data.servicio.descripcion,
            cantidad: data.servicio.cantidad,
            precio: data.servicio.precio,
          },
        ]);
      } else if (Array.isArray(data?.servicios)) {
        setServiciosFactura(
          data.servicios.map((s: any) => ({
            
            nombre: s.descripcion ?? s.nombre,
            cantidad: s.cantidad ?? 1,
            precio: s.precio ?? 0,
          }))
        );
      }

      if (data?.totales) {
        setTotalesPreview({
          subtotal: Number(data.totales.subtotal ?? 0),
          isv15: Number(data.totales.isv15 ?? 0),
          total: Number(data.totales.total ?? 0),
        });
      } else {
        const subtotal = (data?.servicio?.precio ?? 0) * (data?.servicio?.cantidad ?? 1);
        const isv15 = subtotal * 0.15;
        setTotalesPreview({ subtotal, isv15, total: subtotal + isv15 });
      }

      if (data?.message) showNotification(data.message, "info");
    } catch (err: any) {
      showApiError(err);
    }
  };

  const handleSearch = () => {
    const value = searchValue.trim();
    if (!value) return;

    const type = determineSearchType(value);
    if (!type) {
      setValidationError("La entrada no coincide con Correo, DNI o Teléfono.");
      return;
    }

    setValidationError(null);
    cargarPaciente(value.toLowerCase(), type);
  };

  useEffect(() => {
    if (!searchValue.trim()) {
      setPaciente(null);
      setUltimaCita(null);
      setServiciosFactura([]);
      setTotalesPreview(null);
      return;
    }

    const timeout = setTimeout(() => handleSearch(), 600);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const generarFactura = async () => {
    if (!ultimaCita?.id) {
      showNotification("No hay una cita seleccionada para generar la factura.", "alert");
      return;
    }

    setGenerando(true);
    setPdfUrl(null);

    try {
      const resp = await axios.post(
        `http://localhost:3000/factura?citaId=${ultimaCita.id}`,
        null,
        {
          ...headers,
          responseType: "blob",
          headers: {
            ...headers.headers,
            Accept: "application/pdf",
          },
        }
        
      );
      

      
      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      showNotification("Factura generada correctamente.", "success");
    } catch (err: any) {
      const data = err?.response?.data;

  // Si viene un Blob (X viene SIEMPRE blob porque pediste PDF)
  if (data instanceof Blob) {
    // Convertir blob → texto → JSON
    data.text().then((text: string) => {
      try {
        const json = JSON.parse(text);
        const msg = json.message || json.error || "Error al generar factura.";
        showNotification(msg, "alert");
      } catch {
        showNotification("Error al procesar la respuesta del servidor.", "alert");
      }
    });
  } else {
    // Si no es blob, manejar normalmente
    const msg = err?.response?.data?.message || "Error al generar factura.";
    showNotification(msg, "alert");
  }
    } finally {
      setGenerando(false);
    }
  };

  const limpiarTodo = () => {
    setPaciente(null);
    setUltimaCita(null);
    setServiciosFactura([]);
    setTotalesPreview(null);
    setPdfUrl(null);
    setSearchValue("");
  };

  const subtotal = totalesPreview ? totalesPreview.subtotal : serviciosFactura.reduce((a, b) => a + b.precio * b.cantidad, 0);
  const isv15 = totalesPreview ? totalesPreview.isv15 : subtotal * 0.15;
  const total = totalesPreview ? totalesPreview.total : subtotal + isv15;

  return (
    <div className="p-8 min-h-screen bg-light text-primary">

      {notification && (
        <Notification
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Confirm dialog modal (overlay) */}
      {showConfirm && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <ConfirmDialog
              message="¿Seguro que deseas iniciar una nueva factura?"
              onConfirm={() => {
                limpiarTodo();
                setShowConfirm(false);
              }}
              onCancel={() => setShowConfirm(false)}
            />
          </div>
        </>
      )}


      

      <header className="flex justify-between items-center mb-8 border-b border-primary/10 pb-4">
        <button>
          <Link className="btn-primary w-32 flex items-center gap-1" to={"/recepcionista"}>
            <FiChevronLeft />
            Regresar
          </Link>
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-1 text-primary">Facturación</h1>
          <p className="text-primary/70">Facturas</p>
        </div>

        <HeaderMenu />
      </header>

      {/* Buscador */}
      <div className="mb-6 p-4 bg-primary/10 rounded-xl shadow-inner">
        <h2 className="text-lg font-semibold mb-3 text-primary">Buscar Paciente</h2>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ingrese Correo, DNI o Teléfono"
              value={searchValue}
              disabled={!!pdfUrl}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full p-3 pl-10 border border-primary/20 rounded-xl shadow-sm focus:ring-2 focus:ring-info focus:border-info transition-all text-primary bg-light disabled:opacity-60"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
          </div>

          <button
            onClick={handleSearch}
            disabled={!!pdfUrl}
            className="btn-accent flex px-4 py-3 disabled:opacity-60"
          >
            <Search size={18} /> Buscar
          </button>
        </div>

        {validationError && (
          <p className="mt-2 text-alert">{validationError}</p>
        )}

        {loading && (
          <p className="mt-2 text-primary/70 text-sm">Buscando...</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {paciente?.notFound && <p className="text-alert font-medium">Paciente no encontrado.</p>}

        {paciente?.error && (
          <p className="text-alert font-medium">
            {paciente.message || "Error al buscar paciente."}
          </p>
        )}

        {paciente && !paciente.notFound && !paciente.error && (
          <div className="p-6 bg-white rounded-xl shadow-lg border border-primary/10 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-primary">Información del Paciente</h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-3 gap-x-6 text-primary text-sm">
              <p><strong>Nombre:</strong> {paciente.nombre}</p>
              <p><strong>Apellido:</strong> {paciente.apellido}</p>
              <p><strong>Correo:</strong> {paciente.correo}</p>
              <p><strong>DNI:</strong> {paciente.dni || "N/A"}</p>                              
              <p><strong>Teléfono:</strong> {paciente.telefono || "N/A"}</p>
              <p><strong>Dirección:</strong> {paciente.direccion || "N/A"}</p>
              <p><strong>Fecha de nacimiento:</strong> {paciente.fechaNac ? new Date(paciente.fechaNac).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        )}

        {ultimaCita && (
          <div className="p-6 bg-white rounded-xl shadow-lg border border-primary/10 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-primary">Última Cita Completada</h3>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-primary">
              <p><strong>Fecha:</strong> {ultimaCita.fecha}</p>
              <p><strong>Hora:</strong> {ultimaCita.hora}</p>
              <p><strong>Doctor:</strong> {doctor ?? "N/A"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white rounded-xl shadow-lg border border-primary/10 mb-6">
        <h3 className="text-2xl font-bold mb-4 text-primary">Servicios</h3>

        <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow">
          <thead className="bg-accent text-primary font-semibold">
            <tr>
              <th className="py-3 px-4">Servicio</th>
              <th className="py-3 px-4">Cant.</th>
              <th className="py-3 px-4">Precio</th>
            </tr>
          </thead>

          <tbody className="text-primary text-sm bg-white">
            {serviciosFactura.map((s, i) => (
              <tr key={i} className="border-t border-primary/10">
                <td className="py-3 px-4">{s.nombre}</td>
                <td className="py-3 px-4">{s.cantidad}</td>
                <td className="py-3 px-4">L {Number(s.precio).toFixed(2)}</td>
              </tr>
            ))}
            {serviciosFactura.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-primary/60">No hay servicios.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 text-center text-primary text-lg grid gap-2 grid-cols-2">
          <div className="text-right">
            <p><strong>Subtotal:</strong></p>
            <p><strong>ISV 15%:</strong></p>
            <p className="text-2xl font-bold mt-2">Total:</p>
          </div>
          <div className="text-left">
            <p>L {subtotal.toFixed(2)}</p>
            <p>L {isv15.toFixed(2)}</p>
            <p className="text-2xl mt-2">L. {total.toFixed(2)}</p>
          </div>
        </div>

        {!pdfUrl && (
          <div className="items-center">
            <button
              onClick={generarFactura}
              disabled={generando || !ultimaCita?.id}
              className="btn-accent shadow-md text-center mt-6 py-3 rounded-lg shadow disabled:opacity-60"
            >
              {generando ? "Generando..." : "Generar factura"}
            </button>
          </div>
        )}

        {pdfUrl && (
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary w-full mt-6 py-3 rounded-lg shadow"
          >
            Nueva factura
          </button>
        )}
      </div>

      {pdfUrl && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-primary">Factura (vista previa)</h2>
          <div className="w-full rounded-xl overflow-hidden shadow-lg border">
            <iframe
              title="Factura PDF"
              src={pdfUrl}
              style={{ width: "100%", height: "800px", border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}



// src/components/Factura/BuscadorPacienteFactura.tsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import modificarInfoService  from "../services/modificarInfoService";

export default function BuscadorPacienteFactura({ onPacienteSeleccionado }) {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [paciente, setPaciente] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validaciones
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dniRegex = /^\d{13}$/; // ajusta si usas 15 dígitos

  const detectarTipo = (value: string) => {
    if (correoRegex.test(value)) return "correo";
    if (dniRegex.test(value)) return "dni";
    return null;
  };

  const buscarPaciente = async () => {
    const value = searchValue.trim();
    if (!value) return;

    const tipo = detectarTipo(value);
    if (!tipo) {
      setErrorMsg("Ingrese un correo válido o un DNI de 13 dígitos.");
      setPaciente(null);
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setPaciente(null);

    try {
      let p;

      if (tipo === "correo") {
        p = await modificarInfoService.buscarPorCorreo(value);
      } else {
        p = await modificarInfoService.buscarPorDni(value);
      }

      setPaciente(p);
      onPacienteSeleccionado?.(p);

    } catch (err: any) {
      console.error(err);

      if (err?.status === 404) {
        setErrorMsg("Paciente no encontrado.");
      } else {
        setErrorMsg("Error al buscar paciente.");
      }

      setPaciente(null);
    } finally {
      setLoading(false);
    }
  };

  // Buscar mientras escribe
  useEffect(() => {
    if (!searchValue.trim()) {
      setPaciente(null);
      return;
    }

    const timeout = setTimeout(() => buscarPaciente(), 600);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <div className="p-4 bg-primary/10 rounded-xl shadow-inner mb-6">
      <h2 className="text-lg font-semibold mb-3 text-primary">
        Buscar Paciente para Facturación
      </h2>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ingrese Correo o DNI"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full p-3 pl-10 border border-primary/20 rounded-xl shadow-sm focus:ring-2 focus:ring-info focus:border-info transition-all text-primary bg-light"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60"
          />
        </div>

        <button
          onClick={buscarPaciente}
          className="btn-accent px-4 py-3"
        >
          Buscar
        </button>
      </div>

      {loading && (
        <p className="mt-2 text-primary/70 text-sm">Buscando…</p>
      )}

      {errorMsg && (
        <p className="mt-2 text-alert font-medium">{errorMsg}</p>
      )}

      {paciente && (
        <div className="mt-4 p-4 bg-light rounded-xl shadow-lg border border-primary/10">
          <h3 className="text-xl font-bold mb-3 text-primary border-b border-primary/10 pb-2">
            Paciente seleccionado
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-primary">
            <p><strong>Correo:</strong> {paciente.correo}</p>
            <p><strong>Nombre:</strong> {paciente.nombre}</p>
            <p><strong>Apellido:</strong> {paciente.apellido}</p>
            <p><strong>DNI:</strong> {paciente.dni}</p>
            <p><strong>Teléfono:</strong> {paciente.telefono}</p>
          </div>
        </div>
      )}
    </div>
  );
}

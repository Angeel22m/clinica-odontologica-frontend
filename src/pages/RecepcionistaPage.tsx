// src/pages/RecepcionistaPage.tsx
import { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Search,
  Calendar,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiSettings, FiUser } from "react-icons/fi";

import EditarPacienteModal from "../components/EditarPacienteModal";
import modificarInfoService, {
  type PacienteModificarPayload,
  type PacienteRecepcionista,
} from "../services/modificarInfoService";
import { getCitasByPaciente } from "../services/citasService";
import type { Cita } from "../types/cita";
import LogoutButton from "../components/LogoutButton";
import RegisterForm from "../components/RecepcionistaComponentes/RegisterForm";

export default function RecepcionistaPage() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Control de acceso: solo RECEPCIONISTA o ADMIN y activo
  if (
    !user ||
    !user.activo ||
    !(user.rol === "RECEPCIONISTA" || user.rol === "ADMIN")
  ) {
    return <Navigate to="/login" replace />;
  }

  const correoRecepcionista: string = user.correo || "Sin correo";

  const [searchEmail, setSearchEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [paciente, setPaciente] = useState<PacienteRecepcionista | any | null>(
    null
  );
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

  const datosIncompletos = (p: any) => {
    if (!p) return false;
    const camposNecesarios = [
      "nombre",
      "apellido",
      "dni",
      "telefono",
      "direccion",
      "fechaNac",
    ];
    return camposNecesarios.some((campo) => !p[campo]);
  };

  const cargarPacienteYCitas = async (correo: string) => {
    setLoading(true);
    setPaciente(null);
    setCitas([]);

    try {
      // Buscar en backend por correo
      const pacienteFormateado = await modificarInfoService.buscarPorCorreo(
        correo
      );

      setPaciente(pacienteFormateado);

      // Cargar citas del mock (todas, no solo del día)
      const citasPaciente = await getCitasByPaciente(pacienteFormateado.id);
      setCitas(citasPaciente);
    } catch (error: any) {
      console.error(error);
      if (error?.status === 404) {
        setPaciente({ notFound: true });
      } else {
        setPaciente({ error: true, message: error?.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchEmail.trim()) return;
    cargarPacienteYCitas(searchEmail.trim().toLowerCase());
  };

  // Buscar automáticamente mientras escribe (debounce)
  useEffect(() => {
    if (!searchEmail.trim()) {
      setPaciente(null);
      setCitas([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleSearch();
    }, 600); // 600 ms de espera

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchEmail]);

  const guardarCambios = async (data: PacienteModificarPayload) => {
    if (!paciente || paciente.notFound || paciente.error) return;

    try {
      setLoading(true);
      await modificarInfoService.completarDatosPorCorreo(
        paciente.correo,
        data
      );

      setPaciente((prev: any) =>
        prev
          ? {
              ...prev,
              ...data,
            }
          : prev
      );
      setModalOpen(false);
      alert("Información actualizada correctamente");
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Error al actualizar la información del paciente");
    } finally {
      setLoading(false);
    }
  };


  // Cerrar el menú de hamburguesa si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="p-8 min-h-screen text-primary relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex flex-col mb-2">
          <h1 className="text-4xl font-bold mb-2 text-primary">
            Recepción
          </h1>
          <p className="text-primary/70">Bienvenido</p>
        </div>

        <div className="flex items-center gap-4 relative">
          <span className="text-sm text-gray-600">
            {correoRecepcionista}
          </span>

          {/* MENÚ DESPLEGABLE */}
          <div className="relative">
            <AnimatePresence mode="wait">
            <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            animate={{rotate: menuOpen ? -90 : 0}}
            transition = {{ duration: 0.2}}
            className="p-2">
            <FiMenu
              className="hover:text-info transition h-7 w-7 cursor-pointer"
            />
            </motion.button>
            </AnimatePresence>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-light rounded-xl shadow-lg py-2 z-50">
              
                <div className="w-full text-left px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                <FiUser />
                <Link>
                  Perfil
                </Link>
                </div>
                
                <div className="w-full text-left px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                <FiSettings />
                <Link>
                  Configuración
                </Link>
                </div>
                
                <div className="w-full text-left px-4 py-2 cursor-pointer">
                <LogoutButton className="">
                  Cerrar sesión
                </LogoutButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Botones principales */}
      <div className="flex gap-4 mb-6">
        <button className="btn-accent shadow-sm"
        onClick={handleOpenModal}
        >
          Registrar Cliente
        </button>
        <RegisterForm open={open} onClose={handleCloseModal}/>
      

        <button className="btn-accent shadow-sm">
          Generar Factura
        </button>
      </div>

      {/* Buscador de pacientes */}
      <div className="mb-6 p-4 bg-gray-100 rounded shadow-sm">
        <h2 className="text-lg font-semibold mb-3">
          Buscar Paciente
        </h2>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="email"
              placeholder="Correo del paciente"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-primary rounded-xl shadow-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Search size={18} /> Buscar
          </button>
        </div>

        {loading && (
          <p className="mt-2 text-gray-600 text-sm">
            Buscando...
          </p>
        )}
      </div>

      {/* Resultados */}
      <div>
        {paciente?.notFound && (
          <p className="text-red-600">
            Paciente no encontrado.
          </p>
        )}

        {paciente?.error && (
          <p className="text-red-600">
            {paciente.message || "Error al buscar paciente."}
          </p>
        )}

        {paciente &&
          !paciente.notFound &&
          !paciente.error && (
            <div className="p-4 bg-white rounded shadow-sm border">
              {/* Información del paciente */}
              <h3 className="text-xl font-semibold mb-2">
                Información del Paciente
              </h3>

              <p>
                <strong>Correo:</strong> {paciente.correo}
              </p>
              <p>
                <strong>Nombre:</strong>{" "}
                {paciente.nombre || "N/A"}
              </p>
              <p>
                <strong>Apellido:</strong>{" "}
                {paciente.apellido || "N/A"}
              </p>
              <p>
                <strong>DNI:</strong> {paciente.dni || "N/A"}
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                {paciente.telefono || "N/A"}
              </p>
              <p>
                <strong>Dirección:</strong>{" "}
                {paciente.direccion || "N/A"}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong>{" "}
                {paciente.fechaNac
                  ? new Date(paciente.fechaNac).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* Datos incompletos */}
              {datosIncompletos(paciente) && (
                <div className="mt-4 p-3 border border-red-600 bg-red-50 rounded flex items-center gap-2">
                  <AlertTriangle
                    size={22}
                    className="text-red-600"
                  />
                  <span className="text-red-800">
                    El paciente tiene datos incompletos.
                  </span>

                  <button
                    className="ml-auto bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => setModalOpen(true)}
                  >
                    Completar datos
                  </button>
                </div>
              )}

              {/* Acciones cuando todo está completo */}
              {!datosIncompletos(paciente) && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                    <Calendar size={18} /> Crear Cita
                  </button>

                  <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                    <ClipboardList size={18} /> Cita de seguimiento
                  </button>

                  <button
                    className="flex items-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700"
                    onClick={() => setModalOpen(true)}
                  >
                    Editar información
                  </button>
                </div>
              )}

              {/* Citas */}
              {citas.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">
                    Citas del paciente
                  </h4>

                  <ul className="space-y-2">
                    {citas.map((cita) => (
                      <li
                        key={cita.id}
                        className="border p-3 rounded shadow-sm flex justify-between"
                      >
                        <span>
                          {new Date(cita.fecha).toLocaleString()}
                        </span>
                        <span className="font-semibold">
                          {cita.estado}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Modal para editar/completar datos */}
      <EditarPacienteModal
        paciente={!paciente || paciente.notFound || paciente.error ? null : paciente}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={guardarCambios}
      />
    </div>
  );
}

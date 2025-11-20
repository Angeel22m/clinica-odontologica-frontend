// src/pages/RecepcionistaPage.tsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
import LogoutButton from "../components/LogoutButton";
import RegisterForm from "../components/RecepcionistaComponentes/RegisterForm";
import { useAuth } from "../hooks/UseAuth";
import ModalAgendarCita from "../components/ModalAgendarCita";

export default function RecepcionistaPage() {

  const [searchEmail, setSearchEmail] = useState("");
  const { nombre,apellido} = useAuth();
  const [open, setOpen] = useState(false);
  const [paciente, setPaciente] = useState<PacienteRecepcionista | any | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
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

    try {
      // Buscar en backend por correo
      const pacienteFormateado = await modificarInfoService.buscarPorCorreo(
        correo
      );

      setPaciente(pacienteFormateado);
    
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
   <div className="p-8 min-h-screen text-primary relative bg-light">
  {/* Header */}
  <header className="flex justify-between items-center mb-6 border-b border-primary/10 pb-4">
    <div className="flex flex-col mb-2">
      <h1 className="text-4xl font-bold mb-2 text-primary">
        Recepción
      </h1>
      <p className="text-primary/70">{nombre} {apellido}</p>
    </div>

    <div className="flex items-center gap-4 relative">    

      {/* MENÚ DESPLEGABLE */}
      <div className="relative" ref={menuRef}>
        <AnimatePresence mode="wait">
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          animate={{rotate: menuOpen ? -90 : 0}}
          transition = {{ duration: 0.2}}
          className="p-2"
        >
          <FiMenu
            className="text-primary hover:text-info transition h-7 w-7 cursor-pointer"
          />
        </motion.button>
        </AnimatePresence>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-light rounded-xl shadow-lg py-2 z-50 border border-primary/10">
          
            <div className="w-full text-left px-4 py-2 text-primary hover:bg-primary/10 cursor-pointer flex items-center gap-2">
            <FiUser />
            <Link>
              Perfil
            </Link>
            </div>
            
            <div className="w-full text-left px-4 py-2 text-primary hover:bg-primary/10 cursor-pointer flex items-center gap-2">
            <FiSettings />
            <Link>
              Configuración
            </Link>
            </div>
            
            {/* Se agrega un separador visual */}
            <hr className="my-1 border-primary/10" />

            <div className="w-full px-2 cursor-pointer">
            <LogoutButton className="text-primary hover:text-alert">
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
    <button className="btn-accent shadow-md"
    onClick={handleOpenModal}
    >
      Registrar Cliente
    </button>
    <RegisterForm open={open} onClose={handleCloseModal}/>
  

    <button className="btn-accent shadow-md">
      Generar Factura
    </button>
  </div>

  {/* Buscador de pacientes */}
  <div className="mb-6 p-4 bg-primary/10 rounded-xl shadow-inner">
    <h2 className="text-lg font-semibold mb-3 text-primary">
      Buscar Paciente
    </h2>

    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <input
          type="email"
          placeholder="Correo del paciente"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          // Clases ajustadas para usar la paleta
          className="w-full p-3 pl-10 border border-primary/20 rounded-xl shadow-sm focus:ring-2 focus:ring-info focus:border-info transition-all text-primary bg-light"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60"
        />
      </div>

      <button
        onClick={handleSearch}
        className="btn-accent px-4 py-3" // Usamos btn-accent y ajustamos el padding
      >
        <Search size={18} /> Buscar
      </button>
    </div>

    {loading && (
      <p className="mt-2 text-primary/70 text-sm">
        Buscando...
      </p>
    )}
  </div>

  {/* Resultados */}
  <div>
    {paciente?.notFound && (
      <p className="text-alert font-medium">
        Paciente no encontrado.
      </p>
    )}

    {paciente?.error && (
      <p className="text-alert font-medium">
        {paciente.message || "Error al buscar paciente."}
      </p>
    )}

    {paciente &&
      !paciente.notFound &&
      !paciente.error && (
        <div className="p-4 bg-light rounded-xl shadow-lg border border-primary/10">
          {/* Información del paciente */}
          <h3 className="text-xl font-bold mb-3 border-b border-primary/10 pb-2 text-primary">
            Información del Paciente
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-primary">
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
          </div>
          

          {/* Datos incompletos */}
          {datosIncompletos(paciente) && (
            <div className="mt-6 p-4 border border-alert bg-alert/10 rounded-xl flex items-center gap-3">
              <AlertTriangle
                size={22}
                className="text-alert flex-shrink-0"
              />
              <span className="text-alert font-medium">
                El paciente tiene datos incompletos.
              </span>

              <button
                className="ml-auto bg-alert text-light px-4 py-2 rounded-lg hover:bg-info transition-colors shadow-md"
                onClick={() => setModalOpen(true)}
              >
                Completar datos
              </button>
            </div>
          )}

          {/* Acciones cuando todo está completo */}
          {!datosIncompletos(paciente) && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
              onClick={() => setShowModal(true)}
              
              className="flex items-center gap-2 bg-success text-light px-4 py-2 rounded-lg hover:opacity-80 transition-opacity shadow-md">
                <Calendar size={18} /> Crear Cita
              </button>

              <button className="flex items-center gap-2 bg-info text-light px-4 py-2 rounded-lg hover:opacity-80 transition-opacity shadow-md">
                <ClipboardList size={18} /> Cita de seguimiento
              </button>

              <button
                className="flex items-center gap-2 bg-primary text-light px-4 py-2 rounded-lg hover:opacity-80 transition-opacity shadow-md"
                onClick={() => setModalOpen(true)}
              >
                Editar información
              </button>
            </div>
          )}          
        </div>
      )}
  </div>
     {showModal && 
           <ModalAgendarCita onClose={() => {
           setShowModal(false);           
           }}pacienteId={paciente.id} /> }


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

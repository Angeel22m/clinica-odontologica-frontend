// src/pages/RecepcionistaPage.tsx
import { useState, useRef, useEffect, useCallback } from "react";
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
import axios from "axios";
import ModalEditarCita from "../components/ModalEditarCita";
import ModalCancelarCita from "../components/modalCancelacion";
import Notification from "../components/Notification";
import HeaderMenu from "../components/HeaderMenu";
type SearchType = 'correo' | 'dni' | 'telefono';

interface NotificationState {
    message: string;
    type: 'success' | 'alert' | 'info';
}


const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

// Reglas de detección para cada tipo de búsqueda
const detectionRules = [
    // 1. DNI (Ejemplo: 8 a 12 dígitos)
    { 
        type: 'dni' as const, 
        //ocho digitos o menos 

        regex:/^\d{12,15}$/,
        errorMessage: 'El DNI o Teléfono es incorrecto.'
    },
    // 2. Teléfono (Ejemplo: 7 a 15 dígitos)
    { 
        type: 'telefono' as const, 
        regex: /^\d{7,11}$/,
        errorMessage: 'El Teléfono es incorrecto.'
    },
    // 3. Correo (Expresión para validar formato básico de email)
    { 
        type: 'correo' as const, 
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Formato de correo inválido.'
    },
    

];

// Función para determinar el tipo de búsqueda
const determineSearchType = (value: string): SearchType | null => {
    // 1. Prueba Correo
    if (detectionRules[2].regex.test(value)) {
        return 'correo';
    }
    
    // 2. Prueba si son solo dígitos
    if (/^\d+$/.test(value)) {
        // Asignamos DNI/Teléfono según la longitud o una preferencia, 
        // o dejamos que el backend intente ambos si son ambiguos.
        // Aquí asumiremos DNI si cumple la longitud o Teléfono si cumple la suya.
        
        if (detectionRules[0].regex.test(value)) return 'dni';
        if (detectionRules[1].regex.test(value)) return 'telefono';
    }
    
    // Si no coincide con ninguna regla, retorna null.
    return null; 
};

export default function RecepcionistaPage() {

  const { nombre,apellido,idUser,rol} = useAuth();
  const [open, setOpen] = useState(false);
  const [paciente, setPaciente] = useState<PacienteRecepcionista | any | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [citaEditando, setCitaEditando] = useState(null);

  const [searchValue, setSearchValue] = useState(""); // Valor del input
  const [refreshKey, setRefreshKey] = useState(0);
  
const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [citaToCancel, setCitaToCancel] = useState<any | null>(null);

  const [validationError, setValidationError] = useState<string | null>(null);
  
const [pacienteId, setPacienteId] = useState<number | null>(null); // Nuevo estado

 // Notificaciones
    const [notification, setNotification] = useState<NotificationState | null>(null);

  useEffect(() => {
    if (notification) {
      // Limpiar la notificación: null es mejor que "" para el chequeo
      const timer = setTimeout(() => setNotification(null), 3000); 
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  const cargarPacienteYCitas = async (value:string , type :SearchType) => {
    setLoading(true);
    setPaciente(null);    
    setPacienteId(null); // Reiniciar pacienteId al iniciar la búsqueda
    setCitasPendientes([]); // Reiniciar citas pendientes al iniciar la búsqueda
    try {

    let pacienteFormateado: PacienteRecepcionista;
            
            
            switch (type) {
                case 'correo':
                    pacienteFormateado = await modificarInfoService.buscarPorCorreo(value);
                    break;
                case 'dni':
                    // Asumimos que tienes modificarInfoService.buscarPorDni implementado
                    pacienteFormateado = await modificarInfoService.buscarPorDni(value);
                    break;
                case 'telefono':
                    // Asumimos que tienes modificarInfoService.buscarPorTelefono implementado
                    pacienteFormateado = await modificarInfoService.buscarPorTelefono(value);
                    break;
                default:
                    throw new Error("Tipo de búsqueda no válido.");
            }
      setPacienteId(pacienteFormateado.id); // Actualizar pacienteId con el ID del paciente encontrado

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
    const value = searchValue.trim();
    if (!value) return;

    // 1. Determinar el tipo de búsqueda
    const type = determineSearchType(value);

    if (!type) {
        setValidationError('La entrada no coincide con ningún formato (Correo, DNI, o Teléfono).');
        return;
    }
    
    setValidationError(null); // Limpiar errores anteriores
    // 2. Ejecutar la carga con el tipo detectado
    cargarPacienteYCitas(value.toLowerCase(), type); 
};

  // Buscar automáticamente mientras escribe (debounce)
 useEffect(() => {
        if (!searchValue.trim()) {
            setPaciente(null); 
            setPacienteId(null);     
            return;
        }

    const timeoutId = window.setTimeout(() => {
      handleSearch();
    }, 600); // 600 ms de espera

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

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
      setRefreshKey(prev => prev + 1);
      setModalOpen(false);
      setNotification({message:"Información actualizada correctamente",type:'success'});
    } catch (error: any) {
      console.error(error);
      setNotification({message:`Error al actualizar la información del paciente ${error?.message}`,type:'alert'});
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


  const fetchCitasPendientes = useCallback(async (id: number|null) => { 
        if (!id) return;
        try {
            const res = await axios.get(`http://localhost:3000/citas/paciente/${id}`,headers);
            setCitasPendientes(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error al cargar las citas pendientes', err);
            setCitasPendientes([]);
        }
    }, []); // Dispara cada vez que pacienteId cambia

    useEffect(() => {
        if (pacienteId) {
            fetchCitasPendientes(pacienteId);
        }
        else{
            setCitasPendientes([]);
        }
    }, [pacienteId, refreshKey, fetchCitasPendientes]);
  
  const handleEditar = (cita) => {
    setCitaEditando(cita);
    setShowModalEditar(true);
    
  };
  
 
const handleCancelacionFinal = async (data: {
    citaId: number;
    motivoCancelacion: string;
    usuarioCancelaId: number; // user.personaId
    rolCancela: string; // 'PACIENTE'
  }) => {
    const { citaId, motivoCancelacion, usuarioCancelaId, rolCancela } = data;
    
    try {
      const res = await axios.patch(
        `http://localhost:3000/citas/${citaId}/cancelar`,
        { 
          motivoCancelacion, 
          usuarioCancelaId, 
          rolCancela 
        },
        headers
      );

      if (res.data.code === 0) {
        // La notificación de éxito se manejará en el ModalCancelarCita
        return true; 
      } else {
        // Lanzar error para que el ModalCancelarCita lo muestre
        throw new Error(res.data.message || 'Error desconocido al cancelar.'); 
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Error al cancelar la cita";
      // Opcional: Mostrar una notificación global además del error en el modal
      setNotification({ message: message, type: 'alert' });
      throw new Error(message); 
    }
  };

  const handleEliminar = (cita: any) => {
    // Ya no usamos ConfirmDialog. Abrimos el modal con el campo de texto.
    setCitaToCancel(cita);
    setShowModalCancelar(true);
  };

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

      <HeaderMenu/>
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

    <Link to="/facturacion" className="btn-accent shadow-md">
          Generar facturas
        </Link>
  </div>

  {/* Buscador de pacientes */}
  <div className="mb-6 p-4 bg-primary/10 rounded-xl shadow-inner">
    <h2 className="text-lg font-semibold mb-3 text-primary">
      Buscar Paciente
    </h2>
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Ingrese Correo, DNI o Teléfono del paciente"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
        className="btn-accent flex  px-4 py-3" // Usamos btn-accent y ajustamos el padding
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

          <div>


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

   
       {/* Citas pendientes */}
          <section className="p-4 bg-light rounded-xl shadow-lg border border-primary/10 ">
            <h2 className="text-xl font-medium mb-3">
              Citas pendientes de asistir
            </h2>
            { citasPendientes.length > 0 ? (
            <div className="flex flex-col h-60 mt-6 overflow-y-auto gap-4 grid-cols-2 grid">
              { citasPendientes.map(cita => (
                <div
                  key = {cita.id}
                  className="p-4 border-l-4 border-accent rounded-lg shadow-sm hover:shadow-lg transition"
                >
                  <div className="text-lg font-semibold text-primary">
                    {cita.servicio?.nombre}
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600">
                    Con: {" "}
                    <span className="font-medium text-dark">
                      {cita.doctor?.persona?.nombre} {cita.doctor?.persona?.apellido}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600">
                    Fecha y Hora:{" "}
                    <span className="font-medium text-dark">
                      {cita.fecha.split("T")[0]} - {cita.hora.length===6 ? cita.hora.slice(1).replace('_', ':') : cita.hora}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEditar(cita)}
                      className="px-3 py-1 rounded-lg btn-nueva-consulta"
                    >Editar
                    </button>
                  
                    <button
                      onClick={() => handleEliminar(cita)}
                      className="px-3 py-1 rounded-lg btn-alert cursor-pointer"
                    >Cancelar
                    </button>
                  </div>
                  
                </div>
              ))}
              
            </div>
            ) : (
            <div>No tiene citas pendientes</div>
            )}
          </section>    
  </div>


     {showModal && 
           <ModalAgendarCita onClose={() => {
           setShowModal(false);           
            setRefreshKey(prev => prev + 1);
           
           }}pacienteId={paciente.id} /> }

            {showModalEditar && citaEditando && (
                   <ModalEditarCita 
                     cita={citaEditando}
                     onClose={() => {setShowModalEditar(false)
                        setRefreshKey(prev => prev + 1);
                     }
                      
                     }
                     onUpdated={() => {{
                       setShowModalEditar(false);                      
                       setRefreshKey(prev => prev + 1);
                      }
                     }}
                   />
                 )}

                 
{/* 5. Renderizar el nuevo modal de cancelación */}
      {showModalCancelar && citaToCancel && (
        <ModalCancelarCita
          cita={citaToCancel}
          onClose={() => setShowModalCancelar(false)}
          onSuccess={() => {
            setShowModalCancelar(false);
            fetchCitasPendientes(pacienteId); // Recargar la lista después de la cancelación exitosa
            setNotification({message:"Cita cancelada correctamente",type:'success'}); // Notificación global
          }}
          onCancelSubmit={handleCancelacionFinal}
          currentUser={{ id:idUser ,role:rol }} // Pasa los datos del usuario
        />
      )}


  {/* Modal para editar/completar datos */}
  <EditarPacienteModal
    paciente={!paciente || paciente.notFound || paciente.error ? null : paciente}
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    onSave={guardarCambios}
  />

    {/* NOTIFICACIONES */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
  
</div>
  );
}

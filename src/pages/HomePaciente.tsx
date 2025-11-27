import { useState, useEffect } from "react";
import ModalAgendarCita from "../components/ModalAgendarCita";
import ModalEditarCita from "../components/ModalEditarCita";
import ModalCancelarCita from "../components/modalCancelacion";
import { FiBell, FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import HeaderMenu from "../components/HeaderMenu";
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";
// Imports de HEAD
import { useAuth } from "../hooks/UseAuth";
import ModalVerificacion from "../components/user/modalVerificacion";
// Imports de Incoming
import EditarPacienteModal from "../components/EditarPacienteModal";
import modificarInfoService, {
  type PacienteModificarPayload,
  type PacienteRecepcionista,
} from "../services/modificarInfoService";

interface NotificationState {
  message: string;
  type: 'success' | 'alert' | 'info';
}

export default function HomePaciente() {
  // 1. Hook de Autenticación (HEAD)
  const {
    user,
    isLoggedIn,
    isVerificado,
    token,
    isLoading,
    idUser,
    rol,
    refreshAuth,
  } = useAuth();

  // 2. Estados unificados
  const [showModal, setShowModal] = useState(false); // Modal Agendar
  const [showModalEditar, setShowModalEditar] = useState(false); // Modal Editar Cita
  const [citasPendientes, setCitasPendientes] = useState<any[]>([]);
  const [citaEditando, setCitaEditando] = useState<any | null>(null);
  
  // Estados para cancelación (HEAD logic)
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [citaToCancel, setCitaToCancel] = useState<any | null>(null);

  // Estados para verificación (HEAD logic)
  const [showModalVerificacion, setShowModalVerificacion] = useState(false);

  // Estados para editar perfil (Incoming logic)
  const [showEditarPacienteModal, setShowEditarPacienteModal] = useState(false);
  const [loading, setLoading] = useState(false); // Para el guardado del perfil

  // Notificaciones y Confirmaciones
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [confirmData, setConfirmData] = useState<{
    mensaje: string;
    onConfirm: () => void;
  } | null>(null);

  // Construcción del objeto persona para el modal de edición (Incoming logic)
  // Se protege con user? para evitar errores si aún carga
  const persona: PacienteRecepcionista = user ? {
    id: user.id,
    correo: user.correo,
    password: "",
    nombre: user.persona?.nombre || "",
    apellido: user.persona?.apellido || "",
    dni: user.persona?.dni || "",
    telefono: user.persona?.telefono || "",
    direccion: user.persona?.direccion || "",
    fechaNac: user.persona?.fechaNac || "",
  } : {} as PacienteRecepcionista;

  // ---- Effects ----

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (isLoggedIn && user && user.personaId) {
      fetchCitasPendientes();
    }
  }, [isLoggedIn, user?.personaId, token]);

  // ---- Early Returns ----

  if (isLoading) {
    return <div className="text-center p-10">Cargando sesión...</div>;
  }

  if (!isLoggedIn || !user || !user.id) {
    window.location.href = "http://localhost:5173/login";
    return null;
  }

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ---- Helpers ----

  // Detectar si está dentro de HOY, MAÑANA o PASADO MAÑANA
  const esCitaProxima = (fechaStr: string) => {
    if (!fechaStr) return false;
    const hoy = new Date();
    const fecha = new Date(fechaStr);
    const hoyMid = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime();
    const fechaMid = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getTime();
    const diffDias = (fechaMid - hoyMid) / (1000 * 60 * 60 * 24);
    return diffDias === 0 || diffDias === 1 || diffDias === 2;
  };

  const formatoHora = (hora: string) =>
    hora.length === 5 ? hora : hora.replace("_", ":");

  const puedeEditar = (cita: any) => cita.estado === "PENDIENTE";
  const puedeConfirmar = (cita: any) => cita.estado === "PENDIENTE";

  // Cancelación automática si faltan < 24 horas y aún está pendiente
  const cancelarPorTiempoRestante = async (cita: any) => {
    const ahora = new Date();
    const fechaCita = new Date(`${cita.fecha} ${cita.hora}`);
    const diffMs = fechaCita.getTime() - ahora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (cita.estado === "PENDIENTE" && diffHoras <= 24) {
      try {
        await axios.patch(`http://localhost:3000/citas/${cita.id}/cancelar`, {}, headers);
        return "CANCELADA";
      } catch {
        return cita.estado;
      }
    }
    return cita.estado;
  };

  // ---- API Calls ----

  const fetchCitasPendientes = async () => {
    try {
      const pacienteId = user.personaId;
      const res = await axios.get(
        `http://localhost:3000/citas/paciente/${pacienteId}`, headers
      );

      let citas = Array.isArray(res.data) ? res.data : [];

      // aplicar cancelación automática
      const nuevas = [];
      for (let c of citas) {
        const nuevoEstado = await cancelarPorTiempoRestante(c);
        nuevas.push({ ...c, estado: nuevoEstado });
      }

      setCitasPendientes(nuevas);
    } catch (err) {
      console.error("Error al cargar citas", err);
    }
  };

  // ---- Handlers ----

  const handleEditar = (cita: any) => {
    setCitaEditando(cita);
    setShowModalEditar(true);
  };

  // Handler unificado usando la lógica de HEAD (PATCH con motivo)
  const handleCancelacionFinal = async (data: {
    citaId: number;
    motivoCancelacion: string;
    usuarioCancelaId: number;
    rolCancela: string;
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

      if (res.data.code === 0 || res.status === 200) {
        return true;
      } else {
        throw new Error(res.data.message || 'Error desconocido al cancelar.');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Error al cancelar la cita";
      setNotification({ message: message, type: 'alert' });
      throw new Error(message);
    }
  };

  const handleEliminar = (cita: any) => {
    // Usamos el ModalCancelarCita (HEAD) en lugar del ConfirmDialog simple
    setCitaToCancel(cita);
    setShowModalCancelar(true);
  };

  const handleConfirmar = (cita: any) => {
    setConfirmData({
      mensaje: "¿Desea confirmar su asistencia a esta cita?",
      onConfirm: async () => {
        try {
          const res = await axios.patch(
            `http://localhost:3000/citas/${cita.id}/confirmar`, {}, headers
          );

          if (res.data?.estado === "CONFIRMADA") {
            setNotification({ message: "Cita confirmada correctamente", type: 'success' });
          }

          fetchCitasPendientes();
        } catch {
          setNotification({ message: "Error al confirmar la cita", type: 'alert' });
        } finally {
          setConfirmData(null);
        }
      },
    });
  };

  // Validaciones de cuenta (HEAD)
  const handleOpenModal = () => {
    if (!isVerificado) {
      setNotification({
        message: "¡Verificación Requerida! Debes verificar tu correo electrónico para agendar citas.",
        type: 'alert'
      });
      return;
    }
    setShowModal(true);
  }

  const handleOpenVerificacion = () => {
    setShowModalVerificacion(true);
  };

  // Actualización de perfil (Incoming)
  const handleUpdateUsuario = async (data: PacienteModificarPayload) => {
    if (!user) return;

    try {
      setLoading(true);
      await modificarInfoService.completarDatosPorCorreoUsuario(
        user.correo,
        data
      );

      setShowEditarPacienteModal(false);
      setNotification({ message: "Información actualizada correctamente", type: 'success' });
      
      // Actualizamos localmente el usuario si es necesario o forzamos un refresh
      if (refreshAuth) refreshAuth(); 

    } catch (error: any) {
      console.error(error);
      setNotification({ message: error?.message || "Error al actualizar la información", type: 'alert' });
    } finally {
      setLoading(false);
    }
  };

  // Filtros de visualización
  const citasProximas = citasPendientes.filter((c) => esCitaProxima(c.fecha));
  const citasOtrasPendientes = citasPendientes.filter((c) => !esCitaProxima(c.fecha));

  return (
    <div className="min-h-screen bg-light text-primary">

      {/* ALERTA DE VERIFICACIÓN */}
      {!isVerificado && (
        <div className="bg-alert-light text-alert p-3 flex items-center justify-center gap-2">
          <FiAlertTriangle className="h-5 w-5" />
          <p className="font-semibold">
            ¡ALERTA! Tu correo aún no está verificado. Debes verificar tu cuenta para poder crear citas.
          </p>
          <button
            onClick={handleOpenVerificacion}
            className="btn-primary"
          >
            Verificar
          </button>
        </div>
      )}

      {/* HEADER: Fusión de HEAD (Saludo) e Incoming (Botón Modificar) */}
      <header className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="text-success text-3xl font-bold mb-3">
          {`Hola, ${user?.persona?.nombre || 'Paciente'}`}
        </div>
        <nav className="flex items-center gap-8">
          <Link
            to={"/Historial"}
            className="hover:text-info transition cursor-pointer"
          >
            Historial clínico
          </Link>

          <button
            onClick={() => setShowEditarPacienteModal(true)}
            className="hover:text-info transition cursor-pointer"
          >
            Modificar usuario
          </button>

          <button
            onClick={handleOpenModal}
            disabled={!isVerificado}
            className={`transition cursor-pointer ${!isVerificado
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:text-info'
              }`}
          >
            Crear cita
          </button>

          <FiBell className="hover:text-info transition h-6 w-6 cursor-pointer" />

          <HeaderMenu />
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-5 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* OTRAS CITAS */}
          <section className="bg-white shadow-xl rounded-xl p-6 md:max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-medium mb-3">
              Citas pendientes de asistir
            </h2>

            {citasOtrasPendientes.length > 0 ? (
              citasOtrasPendientes.map((cita) => (
                <div
                  key={cita.id}
                  className="p-4 border-l-4 border-accent rounded-lg shadow-sm hover:shadow-lg transition mb-4"
                >
                  <div className="text-lg font-semibold text-primary">
                    {cita.servicio?.nombre}
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Con{" "}
                    <span className="font-medium text-dark">
                      {cita.doctor?.persona?.nombre}{" "}
                      {cita.doctor?.persona?.apellido}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Fecha y Hora:{" "}
                    <span className="font-medium text-dark">
                      {cita.fecha.split("T")[0]} - {formatoHora(cita.hora)}
                    </span>
                  </div>

                  <div className="mt-1 text-sm">
                    Estado:{" "}
                    <span className="text-primary font-semibold">
                      {cita.estado}
                    </span>
                  </div>

                  {cita.estado === "CANCELADA" ? (
                    <p className="text-alert mt-3 font-medium">
                      Esta cita fue cancelada. Por favor programe una nueva.
                    </p>
                  ) : (
                    <div className="mt-2 flex justify-center gap-3">
                      <button
                        disabled={!puedeEditar(cita)}
                        onClick={() => handleEditar(cita)}
                        className={`px-3 py-1 rounded-lg btn-nueva-consulta ${!puedeEditar(cita)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleEliminar(cita)}
                        className="px-3 py-1 rounded-lg btn-alert cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No tiene citas pendientes</p>
            )}
          </section>

          {/* Citas próximas */}
          <section className="bg-white shadow-xl rounded-xl p-6 md:max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-medium mb-3">Citas próximas</h2>

            {citasProximas.length > 0 ? (
              citasProximas.map((cita) => (
                <div
                  key={cita.id}
                  className="p-4 border-l-4 border-accent rounded-lg shadow-sm hover:shadow-lg transition mb-4"
                >
                  <div className="text-lg font-semibold text-primary">
                    {cita.servicio?.nombre}
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Con{" "}
                    <span className="font-medium text-dark">
                      {cita.doctor?.persona?.nombre}{" "}
                      {cita.doctor?.persona?.apellido}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Fecha:{" "}
                    <span className="font-medium text-dark">
                      {cita.fecha.split("T")[0]} - {formatoHora(cita.hora)}
                    </span>
                  </div>

                  <div className="mt-1 text-sm">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${cita.estado === "CONFIRMADA"
                          ? "text-success"
                          : cita.estado === "CANCELADA"
                            ? "text-alert"
                            : "text-primary"
                        }`}
                    >
                      {cita.estado}
                    </span>
                  </div>

                  {cita.estado === "CANCELADA" ? (
                    <p className="text-alert mt-3 font-medium">
                      Esta cita fue cancelada. Por favor programe una nueva.
                    </p>
                  ) : (
                    <div className="mt-2 flex justify-center gap-3">
                      {cita.estado !== "CONFIRMADA" && (
                        <button
                          disabled={!puedeConfirmar(cita)}
                          onClick={() => handleConfirmar(cita)}
                          className="px-3 py-1 rounded-lg btn-nueva-consulta"
                        >
                          Confirmar cita
                        </button>
                      )}

                      {cita.estado === "PENDIENTE" && (
                        <button
                          onClick={() => handleEditar(cita)}
                          className="px-3 py-1 rounded-lg btn-nueva-consulta"
                        >
                          Modificar
                        </button>
                      )}

                      <button
                        onClick={() => handleEliminar(cita)}
                        className="px-3 py-1 rounded-lg btn-alert cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No tiene citas próximas</p>
            )}
          </section>
        </div>
      </main>

      {/* MODALES */}
      
      {/* 1. Agendar Cita */}
      {showModal && (
        <ModalAgendarCita
          onClose={() => {
            setShowModal(false);
            fetchCitasPendientes();
          }}
        />
      )}

      {/* 2. Editar Cita */}
      {showModalEditar && citaEditando && (
        <ModalEditarCita
          cita={citaEditando}
          onClose={() => setShowModalEditar(false)}
          onUpdated={() => {
            setShowModalEditar(false);
            fetchCitasPendientes();
          }}
        />
      )}

      {/* 3. Verificación de Usuario (HEAD) */}
      {showModalVerificacion && (
        <ModalVerificacion
          clienteid={user.personaId}
          token={token}
          setNotification={setNotification}
          onSuccess={() => {
            setShowModalVerificacion(false);
          }}
          refreshAuth={refreshAuth}
          onClose={() => setShowModalVerificacion(false)}
        />
      )}

      {/* 4. Cancelar Cita con Motivo (HEAD) */}
      {showModalCancelar && citaToCancel && (
        <ModalCancelarCita
          cita={citaToCancel}
          onClose={() => setShowModalCancelar(false)}
          onSuccess={() => {
            setShowModalCancelar(false);
            fetchCitasPendientes();
            setNotification({ message: "Cita cancelada correctamente", type: 'success' });
          }}
          onCancelSubmit={handleCancelacionFinal}
          currentUser={{ id: idUser, role: rol }}
        />
      )}

      {/* 5. Editar Perfil de Paciente (Incoming) */}
      {showEditarPacienteModal && (
        <EditarPacienteModal
          open={showEditarPacienteModal}
          paciente={persona}
          user={true}
          onSave={handleUpdateUsuario}
          onClose={() => setShowEditarPacienteModal(false)}
        />
      )}

      {/* CONFIRMACIONES (Usado para confirmar asistencia) */}
      {confirmData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <ConfirmDialog
            message={confirmData.mensaje}
            onConfirm={confirmData.onConfirm}
            onCancel={() => setConfirmData(null)}
          />
        </div>
      )}

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
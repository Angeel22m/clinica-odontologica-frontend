import { useState, useEffect } from "react";
import ModalAgendarCita from "../components/ModalAgendarCita";
import ModalEditarCita from "../components/ModalEditarCita";
import ModalCancelarCita from "../components/modalCancelacion";
import { FiBell,FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import HeaderMenu from "../components/HeaderMenu";
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../hooks/UseAuth";
import ModalVerificacion from "../components/user/modalVerificacion";

interface NotificationState {
    message: string;
    type: 'success' | 'alert' | 'info';
}

export default function HomePaciente() {
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

  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);

const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [citaToCancel, setCitaToCancel] = useState<any | null>(null);

  const [citasPendientes, setCitasPendientes] = useState<any[]>([]);
  const [citaEditando, setCitaEditando] = useState<any | null>(null);
const [showModalVerificacion, setShowModalVerificacion] = useState(false);


  // Notificaciones
    const [notification, setNotification] = useState<NotificationState | null>(null);
  const [confirmData, setConfirmData] = useState<{
    mensaje: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    if (notification) {
      // Limpiar la notificación: null es mejor que "" para el chequeo
      const timer = setTimeout(() => setNotification(null), 3000); 
      return () => clearTimeout(timer);
    }
  }, [notification]);

 useEffect(() => {
   if (isLoggedIn && user && user.personaId) {
      fetchCitasPendientes();
    }
  }, [isLoggedIn, user?.personaId, token]);

 

  if (isLoading) {
    // Mostrar un loader mientras se lee localStorage
    return <div className="text-center p-10">Cargando sesión...</div>; 
  }

if (!isLoggedIn || !user || !user.id) { 
    // Si no está logueado, redirigir.
    window.location.href = "http://localhost:5173/login";
    return null;
  }

const headers = {
      headers: { Authorization: `Bearer ${token}` },
  };

  // ---- Helpers ----

  // Detectar si está dentro de HOY, MAÑANA o PASADO MAÑANA
  const esCitaProxima = (fechaStr: string) => {
    // ... (lógica sin cambios)
    if (!fechaStr) return false;

    const hoy = new Date();
    const fecha = new Date(fechaStr);

    const hoyMid = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    ).getTime();

    const fechaMid = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate()
    ).getTime();

    const diffDias = (fechaMid - hoyMid) / (1000 * 60 * 60 * 24);

    return diffDias === 0 || diffDias === 1 || diffDias === 2;
  };

  // Cancelación automática si faltan < 24 horas y aún está pendiente
  const cancelarPorTiempoRestante = async (cita: any) => {
    // ... (lógica sin cambios)
    const ahora = new Date();
    const fechaCita = new Date(`${cita.fecha} ${cita.hora}`);

    const diffMs = fechaCita.getTime() - ahora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (cita.estado === "PENDIENTE" && diffHoras <= 24) {
      // cancelar en backend
      try {
        await axios.patch(`http://localhost:3000/citas/${cita.id}/cancelar`,{},headers);
        return "CANCELADA";
      } catch {
        return cita.estado;
      }
    }

    return cita.estado;
  };

  const fetchCitasPendientes = async () => {
    try {
      // user.personaId está garantizado aquí
      const pacienteId = user.personaId; 
      const res = await axios.get(
        `http://localhost:3000/citas/paciente/${pacienteId}`,headers
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



  const handleEditar = (cita: any) => {
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

  const handleConfirmar = (cita: any) => {
    // ... (lógica sin cambios)
    setConfirmData({
      mensaje: "¿Desea confirmar su asistencia a esta cita?",
      onConfirm: async () => {
        try {
          const res = await axios.patch(
            `http://localhost:3000/citas/${cita.id}/confirmar`,{},headers
          );

          if (res.data?.estado === "CONFIRMADA") {
            setNotification({message:"Cita confirmada correctamente",type:'success'});
          }

          fetchCitasPendientes();
        } catch {
          setNotification({message:"Error al confirmar la cita",type:'alert'});
        } finally {
          setConfirmData(null);
        }
      },
    });
  };
    
  // Nuevo handler para abrir el modal (con check de verificación)
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

  const citasProximas = citasPendientes.filter((c) =>
    esCitaProxima(c.fecha)
  );

  const citasOtrasPendientes = citasPendientes.filter(
    (c) => !esCitaProxima(c.fecha)
  );

  const formatoHora = (hora: string) =>
    hora.length === 5 ? hora : hora.replace("_", ":");

  const puedeEditar = (cita: any) => cita.estado === "PENDIENTE";
  const puedeConfirmar = (cita: any) => cita.estado === "PENDIENTE";

const handleOpenVerificacion = () => {
    setShowModalVerificacion(true);
};




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
        className=" btn-primary"
      >
        Verificar
      </button>
        </div>
      )}

      {/* NOTIFICACIONES Y MODALES (Aquí irían ModalAgendarCita, ModalEditarCita, ConfirmDialog) */}

      {/* HEADER */}
      <header className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="text-success text-3xl font-bold mb-3">
          {/* CORRECCIÓN DE ERROR: Usar encadenamiento opcional */}
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
            onClick={handleOpenModal}
            disabled={!isVerificado}
            className={`transition cursor-pointer ${
                !isVerificado 
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

                  {/* Si CANCELADA → NO mostrar botones */}
                  {cita.estado === "CANCELADA" ? (
                    <p className="text-alert mt-3 font-medium">
                      Esta cita fue cancelada. Por favor programe una nueva.
                    </p>
                  ) : (
                    <div className="mt-2 flex justify-center gap-3">
                      <button
                        disabled={!puedeEditar(cita)}
                        onClick={() => handleEditar(cita)}
                        className={`px-3 py-1 rounded-lg btn-nueva-consulta ${
                          !puedeEditar(cita)
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
                      className={`font-semibold ${
                        cita.estado === "CONFIRMADA"
                          ? "text-success"
                          : cita.estado === "CANCELADA"
                          ? "text-alert"
                          : "text-primary"
                      }`}
                    >
                      {cita.estado}
                    </span>
                  </div>

                  {/* Si CANCELADA → solo mensaje */}
                  {cita.estado === "CANCELADA" ? (
                    <p className="text-alert mt-3 font-medium">
                      Esta cita fue cancelada. Por favor programe una nueva.
                    </p>
                  ) : (
                    <div className="mt-2 flex justify-center gap-3">
                      {/* Confirmar */}
                      {cita.estado !== "CONFIRMADA" && (
                        <button
                          disabled={!puedeConfirmar(cita)}
                          onClick={() => handleConfirmar(cita)}
                          className="px-3 py-1 rounded-lg btn-nueva-consulta"
                        >
                          Confirmar cita
                        </button>
                      )}

                      {/* Editar solo si está pendiente */}
                      {cita.estado === "PENDIENTE" && (
                        <button
                          onClick={() => handleEditar(cita)}
                          className="px-3 py-1 rounded-lg btn-nueva-consulta"
                        >
                          Editar
                        </button>
                      )}

                      {/* Cancelar */}
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
      {showModal && (
        <ModalAgendarCita      
          onClose={() => {
            setShowModal(false);
            fetchCitasPendientes();
          }}
        />
      )}

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

{/* 5. Renderizar el nuevo modal de cancelación */}
      {showModalCancelar && citaToCancel && (
        <ModalCancelarCita
          cita={citaToCancel}
          onClose={() => setShowModalCancelar(false)}
          onSuccess={() => {
            setShowModalCancelar(false);
            fetchCitasPendientes(); // Recargar la lista después de la cancelación exitosa
            setNotification({message:"Cita cancelada correctamente",type:'success'}); // Notificación global
          }}
          onCancelSubmit={handleCancelacionFinal}
          currentUser={{ id:idUser ,role:rol }} // Pasa los datos del usuario
        />
      )}

      {/* CONFIRMACIONES */}
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

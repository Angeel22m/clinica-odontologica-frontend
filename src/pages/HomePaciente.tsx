import { useState, useEffect } from "react";
import ModalAgendarCita from "../components/ModalAgendarCita";
import ModalEditarCita from "../components/ModalEditarCita";
import { FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import HeaderMenu from "../components/HeaderMenu";
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";

export default function HomePaciente() {
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [citasPendientes, setCitasPendientes] = useState<any[]>([]);
  const [citaEditando, setCitaEditando] = useState<any | null>(null);

  // Notificaciones
  const [notification, setNotification] = useState("");
  const [confirmData, setConfirmData] = useState<{
    mensaje: string;
    onConfirm: () => void;
  } | null>(null);

  const user = JSON.parse(localStorage.getItem("user") as string);
  if (!user || !user.id) {
    window.location.href = "http://localhost:5173/login";
    return null;
  }

  // ---- Helpers ----

  // Detectar si está dentro de HOY, MAÑANA o PASADO MAÑANA
  const esCitaProxima = (fechaStr: string) => {
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
    const ahora = new Date();
    const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);

    const diffMs = fechaCita.getTime() - ahora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (cita.estado === "PENDIENTE" && diffHoras <= 24) {
      // cancelar en backend
      try {
        await axios.patch(`http://localhost:3000/citas/${cita.id}/cancelar`);
        return "CANCELADA";
      } catch {
        return cita.estado;
      }
    }

    return cita.estado;
  };

  const fetchCitasPendientes = async () => {
    try {
      const pacienteId = user.personaId;
      const res = await axios.get(
        `http://localhost:3000/citas/paciente/${pacienteId}`
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

  useEffect(() => {
    fetchCitasPendientes();
  }, []);

  const handleEditar = (cita: any) => {
    setCitaEditando(cita);
    setShowModalEditar(true);
  };

  const handleEliminar = (cita: any) => {
    setConfirmData({
      mensaje: "¿Seguro que desea cancelar esta cita?",
      onConfirm: async () => {
        try {
          const res = await axios.patch(
            `http://localhost:3000/citas/${cita.id}/cancelar`
          );

          if (res.data.code === 0) {
            setNotification("Cita cancelada correctamente");
            fetchCitasPendientes();
          } else {
            setNotification(res.data.message);
          }
        } catch {
          setNotification("Error al cancelar la cita");
        } finally {
          setConfirmData(null);
        }
      },
    });
  };

  const handleConfirmar = (cita: any) => {
    setConfirmData({
      mensaje: "¿Desea confirmar su asistencia a esta cita?",
      onConfirm: async () => {
        try {
          const res = await axios.patch(
            `http://localhost:3000/citas/${cita.id}/confirmar`
          );

          if (res.data?.estado === "CONFIRMADA") {
            setNotification("Cita confirmada correctamente");
          }

          fetchCitasPendientes();
        } catch {
          setNotification("Error al confirmar la cita");
        } finally {
          setConfirmData(null);
        }
      },
    });
  };

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

  return (
    <div className="min-h-screen bg-light text-primary">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="text-success text-3xl font-bold mb-3">
          {`Hola, ${user.persona.nombre}`}
        </div>
        <nav className="flex items-center gap-8">
          <Link
            to={"/Historial"}
            className="hover:text-info transition cursor-pointer"
          >
            Historial clínico
          </Link>

          <button
            onClick={() => setShowModal(true)}
            className="hover:text-info transition cursor-pointer"
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
          message={notification}
          onClose={() => setNotification("")}
        />
      )}
    </div>
  );
}

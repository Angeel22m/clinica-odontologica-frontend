import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalAgendarCita({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tipoAtencion: "",
    fecha: "",
    hora: "",
    doctor: "",
    comentarios: "",
  });

  const [horasDisponibles, setHorasDisponibles] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función fake para simular horarios según tipo de atención y día
  const generarHorasDisponibles = (tipo, fecha) => {
    if (!tipo || !fecha) return [];

    const dia = new Date(fecha).getDay(); // 0 = domingo
    let horas = [];

    switch (tipo) {
      case "Consulta general":
        horas = ["09:00", "10:00", "11:00", "14:00", "15:00"];
        break;
      case "Limpieza dental":
        horas = ["09:30", "11:30", "15:00"];
        break;
      case "Revisión":
        horas = ["10:00", "12:00", "16:00"];
        break;
      case "Ortodoncia":
        horas = ["10:30", "13:00", "15:30"];
        break;
      case "Extracción":
        horas = ["09:00", "11:00", "14:00"];
        break;
      case "Blanqueamiento":
        horas = ["12:00", "14:30", "16:00"];
        break;
      default:
        horas = [];
    }

    if (dia === 0) return []; // Domingo sin citas
    if (dia === 3) return horas.filter((_, i) => i % 2 === 0); // Miércoles mitad

    return horas;
  };

  // Actualizar horarios cuando cambia tipo o fecha
  useEffect(() => {
    const horas = generarHorasDisponibles(formData.tipoAtencion, formData.fecha);
    setHorasDisponibles(horas);
    if (!horas.includes(formData.hora)) {
      setFormData({ ...formData, hora: "" });
    }
  }, [formData.tipoAtencion, formData.fecha]);

  const handleNext = () => {
    if (!formData.tipoAtencion || !formData.fecha || !formData.hora) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleConfirm = () => {
    alert("✅ Cita creada exitosamente");
    onClose();
  };

  return (
    <div className="">
      <div className="fixed inset-0 overlay-dark flex items-center justify-center z-50">
        <motion.div
          layout
          className="bg-light rounded-2xl shadow-lg w-full max-w-lg p-6 relative"
        >
          <h2 className="text-2xl font-semibold text-primary mb-4 text-center">
            {step === 1 ? "Agendar Cita" : "Confirmar Cita"}
          </h2>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Tipo de atención */}
                <div>
                  <label className="block text-md font-medium text-primary/70">
                    Tipo de atención *
                  </label>
                  <select
                    name="tipoAtencion"
                    className="w-full border rounded-lg p-2 mt-1"
                    value={formData.tipoAtencion}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Consulta general">Consulta general</option>
                    <option value="Limpieza dental">Limpieza dental</option>
                    <option value="Revisión">Revisión</option>
                    <option value="Ortodoncia">Ortodoncia</option>
                    <option value="Extracción">Extracción</option>
                    <option value="Blanqueamiento">Blanqueamiento</option>
                  </select>
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-md font-medium text-primary/70">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    className="w-full border rounded-lg p-2 mt-1"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Horarios disponibles */}
                <div>
                  <label className="block text-md font-medium text-primary/70">
                    Horas disponibles *
                  </label>

                  {formData.tipoAtencion && formData.fecha ? (
                    horasDisponibles.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {horasDisponibles.map((hora) => (
                          <button
                            key={hora}
                            type="button"
                            className={`p-2 rounded-lg border transition 
                              ${
                                formData.hora === hora
                                  ? "bg-blue-500 text-white border-blue-600"
                                  : "bg-white text-primary border-primary/30 hover:bg-blue-50"
                              }`}
                            onClick={() =>
                              setFormData({ ...formData, hora })
                            }
                          >
                            {hora}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2">
                        No hay horarios disponibles para esta fecha.
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      Seleccione tipo y fecha para ver disponibilidad.
                    </p>
                  )}
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-md font-medium text-primary/70">
                    Doctor (opcional)
                  </label>
                  <input
                    type="text"
                    name="doctor"
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="Ej. Dra. López"
                    value={formData.doctor}
                    onChange={handleChange}
                  />
                </div>

                {/* Comentarios */}
                <div>
                  <label className="block text-md font-medium text-primary/70">
                    Comentarios (opcional)
                  </label>
                  <textarea
                    name="comentarios"
                    rows="2"
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="Ej. dolor en muela izquierda..."
                    value={formData.comentarios}
                    onChange={handleChange}
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={onClose}
                    className="btn-primary bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-primary bg-success text-light hover:bg-success/90"
                  >
                    Siguiente ➜
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2 mb-4">
                  <p>
                    <strong>Tipo de atención:</strong> {formData.tipoAtencion}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {formData.fecha}
                  </p>
                  <p>
                    <strong>Hora:</strong> {formData.hora}
                  </p>
                  {formData.doctor && (
                    <p>
                      <strong>Doctor:</strong> {formData.doctor}
                    </p>
                  )}
                  {formData.comentarios && (
                    <p>
                      <strong>Comentarios:</strong> {formData.comentarios}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleBack}
                    className="btn-primary bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="btn-primary bg-success text-light hover:bg-success/90"
                  >
                    Confirmar cita
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}


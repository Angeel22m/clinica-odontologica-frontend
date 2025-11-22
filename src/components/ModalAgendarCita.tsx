import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Notification from "../components/Notification";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export default function ModalAgendarCita({ onClose, pacienteId }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    servicioId: "",
    fecha: "",
    hora: "",
    doctorId: "",
    comentarios: "",
  });

  const [notification, setNotification] = useState("");
  const [servicios, setServicios] = useState([]);
  const [doctoresDisponibles, setDoctoresDisponibles] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  // --- Cargar servicios activos ---
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get("http://localhost:3000/servicios",headers);
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setServicios(data.filter(s => s.activo === true || s.activo === "activo"));
      } catch (err) {
        console.error("Error al cargar servicios:", err);
      }
    };
    fetchServicios();
  }, []);

  // --- Cargar doctores disponibles cuando se seleccione tipo de atención y fecha ---
  useEffect(() => {
    const fetchDoctores = async () => {
      if (!formData.servicioId || !formData.fecha) {
        setDoctoresDisponibles([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:3000/citas/doctores-disponibles?fecha=${formData.fecha}`,headers);

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.message)
          ? res.data.message
          : [];

        setDoctoresDisponibles(data);

        // Reset doctorId si el seleccionado no está en la lista
        if (!data.some(d => d.id === parseInt(formData.doctorId))) {
          setFormData(prev => ({ ...prev, doctorId: "" }));
        }
      } catch (err) {
        console.error("Error al obtener doctores disponibles:", err);
        setDoctoresDisponibles([]);
      }
    };

    fetchDoctores();
  }, [formData.tipoAtencion, formData.fecha]);

  // --- Cargar horas disponibles cuando se seleccione doctor y fecha ---
  useEffect(() => {
    const fetchHoras = async () => {
      if (!formData.fecha || !formData.doctorId) {
        setHorasDisponibles([]);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/citas/horas-disponibles?doctorId=${formData.doctorId}&fecha=${formData.fecha}`,headers);

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.message)
          ? res.data.message
          : [];

        setHorasDisponibles(data);

        if (!data.includes(formData.hora)) {
          setFormData(prev => ({ ...prev, hora: "" }));
        }
      } catch (err) {
        console.error("Error al obtener horas disponibles:", err);
        setHorasDisponibles([]);
      }
    };

    fetchHoras();
  }, [formData.fecha, formData.doctorId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (!formData.servicioId || !formData.fecha || !formData.hora || !formData.doctorId) {
      setNotification("Por favor completa todos los campos obligatorios.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);
  
  const handleConfirm = async () => {
    try {
      const payload = {
        servicioId: parseInt(formData.servicioId),
        fecha: formData.fecha,
        hora: formData.hora,
        doctorId: parseInt(formData.doctorId),
        pacienteId: parseInt(pacienteId) || parseInt(JSON.parse(localStorage.getItem('user')).persona.id),
      };
      const res = await axios.post("http://localhost:3000/citas", payload,headers);
        console.log(res.data);
      if (res.data.code === 0) {
      console.log("Cita creada:", res.data);
	
        setNotification("Cita creada exitosamente");

setTimeout(() => {
  onClose();
}, 2000); // 2 segundos para que se vea

      } else {
        setNotification("Error: hola " + res.data.message);
      }
    } catch (err) {
      
      console.error("Error al crear cita:", err);
      setNotification("Error al crear cita");
    }
  };
  
    useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
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
                <label className="block text-md font-medium text-primary/70">Tipo de atención *</label>
                <select
                  name="servicioId"
                  className="w-full border rounded-lg p-2 mt-1"
                  value={formData.servicioId}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {servicios.map(serv => (
                    <option key={serv.id} value={serv.id}>{serv.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-md font-medium text-primary/70">Fecha *</label>
                <input
                  type="date"
                  name="fecha"
                  className="w-full border rounded-lg p-2 mt-1"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Doctor */}
              <div>
                <label className="block text-md font-medium text-primary/70">Doctor *</label>
                <select
                  name="doctorId"
                  className="w-full border rounded-lg p-2 mt-1"
                  value={formData.doctorId}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {Array.isArray(doctoresDisponibles) && doctoresDisponibles.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Horas disponibles */}
              <div>
                <label className="block text-md font-medium text-primary/70">Horas disponibles *</label>
                {Array.isArray(horasDisponibles) && horasDisponibles.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {horasDisponibles.map(hora => (
                      <button
                        key={hora}
                        type="button"
                        className={`p-2 rounded-lg border transition cursor-pointer ${
                          formData.hora === hora
                            ? "bg-info text-light"
                            : "bg-white text-primary border-primary/30 hover:bg-info"
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, hora }))}
                      >
                        {hora}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">Seleccione fecha y doctor para ver horarios disponibles.</p>
                )}
              </div> 
              

              {/* Botones */}
              <div className="flex justify-between mt-4">
                <button onClick={onClose} className="btn-primary bg-primary/10 text-primary hover:bg-primary/10">Cancelar</button>
                <button onClick={handleNext} className="btn-primary bg-success text-light hover:bg-success/90">Siguiente ➜</button>
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
                <p><strong>Tipo de atención:</strong> {servicios.find(s=>s.id === parseInt(formData.servicioId))?.nombre}</p>
                <p><strong>Fecha:</strong> {formData.fecha}</p>
                <p><strong>Hora:</strong> {formData.hora.replace('_', ':')}</p>
                <p><strong>Doctor:</strong> {doctoresDisponibles.find(d => d.id === parseInt(formData.doctorId))?.nombre}</p>
                {formData.comentarios && <p><strong>Comentarios:</strong> {formData.comentarios}</p>}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={handleBack} className="btn-primary bg-primary/10 text-primary hover:bg-primary/20">← Volver</button>
                <button onClick={handleConfirm} className="btn-primary bg-success text-light hover:bg-success/90">Confirmar cita</button>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
              {notification && (
        	<Notification message={notification} 
        	onClose={() => setNotification("")} />
      		)}      
    </div>
  );
}


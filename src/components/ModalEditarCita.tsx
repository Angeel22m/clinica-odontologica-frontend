import { useState, useEffect } from "react";
import axios from "axios";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};  

export default function ModalEditarCita({ cita, onClose, onUpdated }) {

  // Normalizar hora proveniente del backend
  const horaInicial =
    cita.hora.length === 6
      ? cita.hora.slice(1).replace("_", ":")
      : cita.hora;

  const [fecha, setFecha] = useState(cita.fecha.split("T")[0]);
  const [hora, setHora] = useState(horaInicial);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  // Cargar horas disponibles al cambiar fecha
  useEffect(() => {
    const fetchHoras = async () => {
      if (!fecha) {
        setHorasDisponibles([]);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:3000/citas/horas-disponibles?doctorId=${cita.doctorId}&fecha=${fecha}`,headers
        );

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.message)
          ? res.data.message
          : [];

        // Convertir formato backend → HH:MM
        const normalizadas = data.map(h =>
          h.length === 6 ? h.slice(1).replace("_", ":") : h
        );

        setHorasDisponibles(normalizadas);

        // Si la hora actual ya no está disponible, limpiarla
        if (!normalizadas.includes(hora)) {
          setHora("");
        }

      } catch (err) {
        console.error("Error al obtener horas:", err);
        setHorasDisponibles([]);
      }
    };

    fetchHoras();
  }, [fecha]);


  // Guardar cambios
  const handleSave = async () => {
    if (!fecha || !hora) {
      alert("Seleccione fecha y hora");
      return;
    }

    // Convertir HH:MM → HHH_MM
    //const horaBackend = "H" + hora.replace(":", "_");

    try {
      const body = {
        fecha,
        hora,
      };
      
      console.log(body);

      const res = await axios.put(
        `http://localhost:3000/citas/${cita.id}`,
        body,headers
      );

      if (res.data.code === 0) {
        onUpdated();
        onClose();
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      console.error("Error al actualizar cita:", err);
      alert("No se pudo actualizar la cita");
    }
  };


  return (
    <div className="fixed inset-0 overlay-dark flex justify-center items-center z-50">
      <div className="bg-light p-6 rounded-2xl shadow-lg w-full max-w-lg">

        <h2 className="text-xl font-semibold text-primary mb-4">
          Editar Cita
        </h2>

        <div className="flex flex-col gap-2">

          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border rounded-md px-3 py-2"
            min={new Date().toISOString().split("T")[0]}
          />

          <label>Hora</label>
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">Seleccione una hora</option>
            {horasDisponibles.map((h, i) => (
              <option key={i} value={h}>{h}</option>
            ))}
          </select>

        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded-lg">
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1 bg-info text-white rounded-lg"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}


import { FiPhone,FiClipboard, FiClock } from "react-icons/fi";
import type {Cita} from "../../types/TypesCitas/CitasPorDoctor"
const formatHora = (code: string): string => {
  if (!code.startsWith("H")) return code;

  const info = code.replace("H", ""); // "09_30"
  const [horaStr, minStr] = info.split("_");

  const hora = parseInt(horaStr, 10);
  const minutos = parseInt(minStr, 10);

  if (isNaN(hora) || isNaN(minutos)) return code;

  const hora12 = hora % 12 || 12;
  const ampm = hora >= 12 ? "PM" : "AM";

  return `${hora12}:${minutos.toString().padStart(2, "0")} ${ampm}`;
};


const CitaCard: React.FC<{ cita: Cita }> = ({ cita }) => {
  const nombrePaciente = `${cita.paciente.nombre} ${cita.paciente.apellido}`;
  const nombreServicio = cita.servicio.nombre;
  const fechaLegible = new Date(cita.fecha).toLocaleDateString();
  const horaLegible = formatHora(cita.hora); // <-- AQUI

  // Colores por estado
  const estadoPillClass =
    cita.estado === "PENDIENTE"
      ? "bg-primary text-light"
      : cita.estado === "CONFIRMADA"
      ? "bg-success text-light"
      : "bg-info text-light";

  const estadoBorderClass =
    cita.estado === "PENDIENTE"
      ? "border-primary"
      : cita.estado === "CONFIRMADA"
      ? "border-success"
      : "border-info";

  const handleAction = (accion: string) => {
    console.log("Acción:", accion, cita.id);
  };

  return (
    <div
      className={`cursor-pointer bg-light border-l-4 rounded-xl p-6 shadow-md hover:shadow-lg transition-all ${estadoBorderClass}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        {/* LEFT: ICON + Paciente */}
        <div className="flex items-center">
          <FiClock className="w-10 h-10 text-accent mr-4 bg-white rounded-full p-2 shadow-sm" />

          <div>
            <h3 className="text-xl font-bold text-primary">
              {nombrePaciente}
            </h3>

            <p className="text-sm text-info">
              {fechaLegible} • {horaLegible} {/* <-- Hora ya legible */}
            </p>
          </div>
        </div>

        {/* ESTADO */}
        <span
          className={`text-xs px-3 py-1.5 rounded-full font-semibold ${estadoPillClass}`}
        >
          {cita.estado}
        </span>
      </div>

      {/* BODY */}
      <div className="text-[15px] text-primary space-y-2">
        <p className="flex items-center gap-2">
          <FiClipboard className="text-accent w-5 h-5" />
          <strong>Servicio:</strong> {nombreServicio}
        </p>

        <p className="flex items-center gap-2">
          <FiPhone className="text-accent w-5 h-5" />
          <strong>Teléfono:</strong> {cita.paciente.telefono}
        </p>

        <p>
          <strong>Precio Ref.:</strong>{" "}
          <span className="text-info font-bold">
            ${cita.servicio.precio.toFixed(2)}
          </span>
        </p>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={() => handleAction("Ver Detalle")}
          className="px-4 py-2 text-sm bg-primary text-light rounded-lg hover:bg-primary/90 transition"
        >
          Ver Detalle
        </button>

        <button
          onClick={() => handleAction("Confirmar")}
          disabled={cita.estado === "CONFIRMADA"}
          className={`px-4 py-2 text-sm rounded-lg transition 
            ${
              cita.estado === "CONFIRMADA"
                ? "bg-success/50 text-light cursor-not-allowed"
                : "bg-success text-light hover:bg-success/90"
            }
          `}
        >
          {cita.estado === "CONFIRMADA" ? "Confirmada" : "Confirmar"}
        </button>
      </div>
    </div>
  );
};

export default CitaCard;
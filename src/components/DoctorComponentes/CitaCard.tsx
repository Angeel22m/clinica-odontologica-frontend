import { FiPhone, FiClipboard, FiClock } from "react-icons/fi";
import type { Cita } from "../../types/TypesCitas/CitasPorDoctor";

const formatHora = (code: string): string => {

  const [horaStr, minStr] = code.split(":");

  const hora = parseInt(horaStr, 10);
  const minutos = parseInt(minStr, 10);

  if (isNaN(hora) || isNaN(minutos) || hora < 0 || hora > 23 || minutos < 0 || minutos > 59) {
    return code; 
  }

  const ampm = hora >= 12 ? "PM" : "AM";

  let hora12 = hora % 12;
  if (hora12 === 0) {
    hora12 = 12; 
  }
  
  const minutosFormato = minutos.toString().padStart(2, "0"); 
  
  return `${hora12}:${minutosFormato} ${ampm}`;
};


const CitaCard: React.FC<{ cita: Cita }> = ({ cita }) => {
  const nombrePaciente = `${cita.paciente.nombre} ${cita.paciente.apellido}`;
  const nombreServicio = cita.servicio.nombre;

  // Formatear fecha para que coincida con la base sin afectar zona horaria
  const fechaLegible = cita.fecha
    ? cita.fecha.substring(0, 10).split("-").reverse().join("/") // "YYYY-MM-DD" -> "DD/MM/YYYY"
    : "";

  const horaLegible = formatHora(cita.hora);
  console.log(horaLegible);

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
            <h3 className="text-xl font-bold text-primary">{nombrePaciente}</h3>

            <p className="text-sm text-info">
              {fechaLegible} • {horaLegible}
            </p>
          </div>
        </div>

        {/* ESTADO */}
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${estadoPillClass}`}>
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
      </div>
    </div>
  );
};

export default CitaCard;

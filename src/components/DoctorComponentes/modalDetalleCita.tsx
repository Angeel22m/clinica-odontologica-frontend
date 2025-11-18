import Modal from "../modal";
import React from "react";
import type { Cita } from "../../types/TypesCitas/CitasPorDoctor";
import { FiClipboard, FiClock, FiMapPin, FiPhone } from "react-icons/fi";
import { PiMoney } from "react-icons/pi";
import { MdOutlineDescription } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

const formatFecha = (code:string) :string  =>{
    const fecha =  code
    ? code.substring(0, 10).split("-").reverse().join("/") // "YYYY-MM-DD" -> "DD/MM/YYYY"
    : "";

    return fecha
};
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


interface ModalDetalleCitaProps {
  open: boolean;
  onClose: () => void;
  cita: Cita;
}
const ModalDetalleCita : React.FC<ModalDetalleCitaProps> = ({
    open,
    onClose,
    cita
}) => {
    const horaCita = formatHora(cita.hora)  
    const fechaCita = formatFecha(cita.fecha)      
    const fechaNacimiento = formatFecha(cita.paciente.fechaNac)

return(

   <Modal open={open} onClose={onClose} title="Detalle Cita">
  <div className="fixed inset-0 bg-black/40 w-full backdrop-blur-sm flex items-center justify-center">
    <div className="bg-light p-6 rounded-xl shadow-lg w-[400px] space-y-4">
      <h2 className="text-xl font-bold text-primary">Detalle de la cita</h2>

      {/* Header: Paciente y estado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FiClock className="w-10 h-10 text-accent bg-white rounded-full p-2 shadow-sm" />
          <div>
            <p className="text-lg font-semibold text-primary">
              {cita.paciente.nombre} {cita.paciente.apellido}
            </p>
            <p className="text-sm text-info">
              {fechaCita} • {horaCita}
            </p>
          </div>
        </div>

        <span
          className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
            cita.estado === "PENDIENTE"
              ? "bg-primary text-light"
              : cita.estado === "CONFIRMADA"
              ? "bg-success text-light"
              : cita.estado === "CANCELADA"
              ? "bg-alert text-light"
              : "bg-info text-light"
          }`}
        >
          {cita.estado}
        </span>
      </div>

      {/* Servicio */}
      <div className="space-y-1 text-primary">
        <p className="flex items-center gap-2">
          <FiClipboard className="text-accent w-5 h-5" />
          <strong>Servicio:</strong> {cita.servicio.nombre}
        </p>

        <p className="flex items-center gap-2">
            <MdOutlineDescription className="text-accent w-5 h-5"/>
            <strong>Descripción:</strong> {cita.servicio.descripcion}</p>
        <p className="flex items-center gap-2">
            <PiMoney className="text-accent w-5 h-5"/><strong>Precio:</strong> ${cita.servicio.precio.toFixed(2)}</p>
      </div>

      {/* Datos del paciente */}
      <div className="space-y-1 text-primary">
        <p className="flex items-center gap-2">
          <FiPhone className="text-accent w-5 h-5" />
          <strong>Teléfono:</strong> {cita.paciente.telefono}
        </p>        

        <p className="flex items-center gap-2">
            <FiMapPin className="text-accent w-5 h-5"/><strong>Dirección:</strong> {cita.paciente.direccion}</p>

        <p className="flex items-cente gap-2">
            <LiaBirthdayCakeSolid className="text-accent w-5 h-5"/>
            <strong>Fecha de nacimiento:</strong> {fechaNacimiento}</p>
      </div>
          <div className="gap-2 flex aling-center">
<button onClick={onClose} className="mt-4 btn-primary w-full">
        Cerrar
      </button>
      
        <Link
      className="mt-4 btn-primary w-full" to={`/expedientes/doctor/${cita.expedienteId}`}>
            Ver Expediente
      </Link>      

          </div>
      

      
    </div>
  </div>
</Modal>

)

}

export default ModalDetalleCita;
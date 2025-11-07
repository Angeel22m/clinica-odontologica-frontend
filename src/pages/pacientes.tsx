import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPacienteById } from "../services/pacientesService";
import type { Paciente } from "../types/Paciente";

const PacienteDetalle: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState<Paciente | null>(null);

  useEffect(() => {
    if (!id) return;
    getPacienteById(Number(id)).then(setP);
  }, [id]);

  if (!p) {
    return (
      <div className="min-h-screen w-full bg-grisClaro text-primario p-6">
        <div className="max-w-3xl mx-auto">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-grisClaro text-primario p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Perfil de Paciente</h1>
          <button onClick={() => nav("/pacientes")} className="px-4 py-2 rounded bg-primario text-white hover:bg-primario/90">
            Volver
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-primario/70">Nombre</p>
            <p className="font-medium">{p.persona.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-primario/70">Apellido</p>
            <p className="font-medium">{p.persona.apellido}</p>
          </div>
          <div>
            <p className="text-sm text-primario/70">DNI</p>
            <p className="font-medium">{p.persona.dni}</p>
          </div>
          <div>
            <p className="text-sm text-primario/70">Teléfono</p>
            <p className="font-medium">{p.persona.telefono}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-primario/70">Dirección</p>
            <p className="font-medium">{p.persona.direccion}</p>
          </div>
          <div>
            <p className="text-sm text-primario/70">Fecha de nacimiento</p>
            <p className="font-medium">{p.persona.fechaNac ? new Date(p.persona.fechaNac).toLocaleDateString() : "-"}</p>
          </div>
          <div>
            <p className="text-sm text-primario/70">Correo (usuario)</p>
            <p className="font-medium">{p.user?.correo}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link to={`/pacientes/${p.persona.id}/citas`} className="px-4 py-2 rounded bg-celeste2 text-white hover:bg-celeste">
            Ver citas
          </Link>
          <Link to={`/pacientes/${p.persona.id}/citas/nueva`} className="px-4 py-2 rounded bg-verde text-white hover:bg-green-600">
            Crear cita
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PacienteDetalle;

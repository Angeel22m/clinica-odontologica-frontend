import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPacienteById } from "../../services/pacientesService";
import { getUserByPersonaId } from "../../services/usersService";
import type { Paciente } from "../../types/Paciente";
import type { User } from "../../types/User";

const PacienteDetallePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pacienteId = Number(id);

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pacienteId) return;

    const fetchData = async () => {
      try {
        const p = await getPacienteById(pacienteId);
        if (!p) {
          navigate("/pacientes");
          return;
        }
        setPaciente(p);

        const u = await getUserByPersonaId(p.personaId);
        setUser(u);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pacienteId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">
        Cargando paciente...
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h2 className="text-xl font-bold text-red-600">Paciente no encontrado</h2>
        <button
          onClick={() => navigate("/pacientes")}
          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Detalle del Paciente
        </h1>

        {/* Datos del paciente */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Datos personales</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-800">
            <p><span className="font-medium">Nombre:</span> {paciente.nombre} {paciente.apellido}</p>
            <p><span className="font-medium">DNI:</span> {paciente.dni}</p>
            <p><span className="font-medium">Teléfono:</span> {paciente.telefono || "No registrado"}</p>
            <p><span className="font-medium">Correo:</span> {paciente.correo}</p>
            <p><span className="font-medium">Dirección:</span> {paciente.direccion || "No registrada"}</p>
            <p><span className="font-medium">Fecha de Nacimiento:</span> {paciente.fechaNac || "No registrada"}</p>
          </div>
        </section>

        {/* Datos de usuario */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Usuario del sistema</h2>

          {user ? (
            <div className="grid grid-cols-2 gap-4 text-gray-800">
              <p><span className="font-medium">Correo:</span> {user.correo}</p>
              <p><span className="font-medium">Rol:</span> {user.rol}</p>
              <p><span className="font-medium">Estado:</span> {user.activo ? "Activo" : "Inactivo"}</p>
            </div>
          ) : (
            <div className="text-red-600 text-sm mb-3">
              Este paciente aún no tiene usuario en el sistema
            </div>
          )}

          {!user && (
            <button
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/pacientes/${pacienteId}/crear-usuario`)}
            >
              Crear usuario para este paciente
            </button>
          )}
        </section>

        {/* Acciones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate(`/pacientes/${pacienteId}/citas`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ver citas
          </button>

          <button
            onClick={() => navigate(`/pacientes/${pacienteId}/citas/nueva`)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
          >
            Crear nueva cita
          </button>

          <button
            onClick={() => navigate("/pacientes")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded ml-auto"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PacienteDetallePage;

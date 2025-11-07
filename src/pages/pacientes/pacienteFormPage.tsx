import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authservice";
import { getPacientes } from "../../services/pacientesService";
import { createExpediente } from "../../services/expedienteService";

const PacienteFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const before = await getPacientes();
    const result = await signup(form);

    if (result?.statusCode === 400) {
      if (Array.isArray(result?.message)) {
        alert("Corrige lo siguiente:\n\n" + result.message.join("\n"));
      } else {
        alert(result?.message);
      }
      setLoading(false);
      return;
    }

    if (result?.code !== 10) {
      alert("Error creando paciente: " + (result?.message || "desconocido"));
      setLoading(false);
      return;
    }

    const after = await getPacientes();
    const newPaciente = after.find((p) => !before.some((b) => b.id === p.id));

    if (newPaciente) {
      await createExpediente(newPaciente.id);
    }

    alert("Paciente registrado correctamente.");
    navigate("/pacientes");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Paciente</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="border p-2 rounded" />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required className="border p-2 rounded" />
        <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} className="border p-2 rounded" />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="border p-2 rounded" />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="fechaNac" placeholder="Fecha de nacimiento" value={form.fechaNac} onChange={handleChange} className="border p-2 rounded" />
        <input type="email" name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} required className="border p-2 rounded" />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required className="border p-2 rounded" />

        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded"
        >
          {loading ? "Creando..." : "Registrar Paciente"}
        </button>
      </form>
    </div>
  );
};

export default PacienteFormPage;

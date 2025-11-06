import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          telefono: formData.telefono || undefined,
          direccion: formData.direccion || undefined,
          fechaNac: formData.fechaNac || undefined,
          correo: formData.correo,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.code !== 10) {
        setError(data.message || "Error en el registro");
      } else {
        setSuccess("Usuario registrado con éxito");
        setFormData({
          nombre: "",
          apellido: "",
          dni: "",
          telefono: "",
          direccion: "",
          fechaNac: "",
          correo: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-light p-8 pt-6 pb-7 rounded-2xl shadow-xl border border-gray-300 w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-5 text-primary text-center">
          Registro de Paciente
        </h2>

        {error && (
          <div className="bg-info text-light p-3 rounded mb-5 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-success text-light p-3 rounded mb-5 text-sm text-center">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { name: "nombre", label: "Nombre", type: "text" },
            { name: "apellido", label: "Apellido", type: "text" },
            { name: "dni", label: "DNI", type: "text" },
            { name: "telefono", label: "Teléfono", type: "tel" },
            { name: "direccion", label: "Dirección", type: "text" },
            { name: "fechaNac", label: "Fecha de nacimiento", type: "date" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="text-primary font-medium mb-2 text-left"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="p-1.5 border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col">
          <label htmlFor="correo" className="text-primary font-medium mb-2 text-left">
            Correo electrónico
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            className="p-1.5 border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-5">
          {[
            { name: "password", label: "Contraseña", type: "password" },
            { name: "confirmPassword", label: "Confirmar contraseña", type: "password" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="text-primary font-medium mb-2 text-left"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="p-1.5 border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-7">
          <button
            type="submit"
            className="flex-1 btn-primary p-2.5 rounded-xl hover:bg-accent transition text-base font-semibold"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = "/landing")}
            className="flex-1 border border-primary text-primary p-2.5 rounded-xl hover:bg-primary hover:text-light transition text-base font-semibold"
          >
            Cancelar
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-info hover:underline text-sm"
            onClick={() => alert("Redirigir a iniciar sesión")}
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>
      </form>
    </div>
  );
}


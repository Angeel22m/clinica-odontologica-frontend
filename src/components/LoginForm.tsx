import { useState } from "react";

interface LoginFormProps {
  onLogin?: (usernameOrEmail: string, password: string) => Promise<boolean>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (onLogin) {
        const success = await onLogin(usernameOrEmail, password);
        if (!success) {
          setError("Credenciales inválidas o usuario no existente");
        }
      } else {
        // Login simulado si no hay backend
        alert("Inicio de sesión simulado exitoso");
      }
    } catch {
      setError("No se puede conectar con el servidor. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white max-h-[90vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-light p-6 rounded-xl shadow-xl border border-gray-300 border-1 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="bg-info text-light p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-primary mb-2 text-left">Correo o Usuario</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full p-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-primary mb-2 text-left">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <button
          type="submit"
          className="w-full btn-primary p-2 rounded hover:bg-accent transition mt-4 mb-3"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-info hover:underline text-sm"
            onClick={() => alert("Redirigir a recuperar contraseña")}
          >
            Olvidé mi contraseña
          </button>
        </div>
      </form>
    </div>
  );
}

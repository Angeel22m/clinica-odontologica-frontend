import { useState } from "react";
import { Link } from "react-router-dom";
interface LoginResult {
  success: boolean;
  error?: string;
}

interface LoginFormProps {
  onLogin?: (usernameOrEmail: string, password: string) => Promise<LoginResult>;
  errorMessage?: string;
}

export default function LoginForm({ onLogin, errorMessage = "" }: LoginFormProps) {
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
        const result = await onLogin(usernameOrEmail, password);
        if (!result.success) {
          setError(result.error || "Credenciales inválidas o usuario no existente");
        
      } else {
          setError("");
      }
     } else {
        alert("Inicio de sesion simulado exitoso");
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

        {(error || errorMessage) && (
          <div className="bg-info text-light p-2 rounded mb-4 text-sm">
            {error || errorMessage}
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
          className="w-full btn-primary p-2 rounded-lg hover:bg-accent transition mt-4 mb-3"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        <div className="flex justify-center gap-12 mt-4 text-center">
          <a
            type="button"
            className="text-info hover:underline text-sm cursor-pointer"
            onClick={() => alert("Redirigir a recuperar contraseña")}
          >
            Olvidé mi contraseña
          </a>
          <Link to="/register" className="text-info hover:underline text-sm cursor-pointer">Registrarse</Link>
          
        </div>
      </form>
    </div>
  );
}

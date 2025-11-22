import LoginForm from "../components/LoginForm";
import axios from "axios";
import { useState } from "react";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  
  const handleLogin = async (
  user: string,
  pass: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      correo: user,
      password: pass,
    },headers);

    const data = response.data;
    console.log("Login response:", data);

    if (data.code === 0) {

      // Guardar datos en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Sacar el rol del user
      const rol = data.user.rol;

      console.log(rol);

      // Redirigir dependiendo del rol
      redirectByRole(rol);

      return { success: true };
    } else {
      const retryAfter = data.retryAfter;
      const code = data.code;
      const msg = data.message || "Error al iniciar sesión";
      setServerError(msg);
      return { success: false, error: msg, code: code, retryAfter: retryAfter};
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "No se pudo conectar con el servidor. Intente más tarde";

    setServerError(message);
    return { success: false, error: message };
  }
};

const redirectByRole = (rol: string) => {
  switch (rol) {
    case "ADMIN":
      window.location.href = "/dashboard";
      break;

    case "DOCTOR":
      window.location.href = "/citas/doctor";
      break;

    case "RECEPCIONISTA":
      window.location.href = "/recepcionista";
      break;

    case "CLIENTE":
      window.location.href = "/home/paciente";
      break;

    default:
      console.warn("Rol no reconocido:", rol);
      window.location.href = "/home";
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-light pt-8 px-4 overflow-auto">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-2">
          Clínica Odontológica
        </h1>
        <p className="text-info font-normal text-lg mb-4">
          Bienvenido, por favor inicia sesión
        </p>

        <LoginForm onLogin={handleLogin} errorMessage={serverError}/>
      </div>
    </div>
  );
}

import LoginForm from "../components/LoginForm";
import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  
  const handleLogin = async (user: string, pass: string): Promise<{ success: boolean; error?: string}> => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo: user,
        password: pass,
      });

      const data = response.data;
      console.log(response.data);
      if (data.code === 0) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
	window.location.href = "/home";
        console.log("Inicio de sesión exitoso");

        return { success: true };
      } else {
        const msg = data.message || "Error al iniciar sesión";
      	setServerError(msg);
        console.error("Error:", data.message);
        return { success: false, error: msg };
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      const message = 
        error.response?.data?.message || "No se pudo conectar con el servidor. Intente más tarde";
      setServerError(message);
      return { success: false, error: message };
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

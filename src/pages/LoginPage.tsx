import LoginForm from "../components/LoginForm";
import axios from "axios";

export default function LoginPage() {
  const handleLogin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo: user,
        password: pass,
      });

      const data = response.data;

      if (data.code === 0) {
        // Guardamos el token JWT en localStorage
        localStorage.setItem("token", data.token);

        // Podés guardar el usuario si querés:
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Inicio de sesión exitoso");
        // Redirigir a otra página (si usás react-router-dom)
        // window.location.href = "/dashboard";

        return true;
      } else {
        console.error("Error:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
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

        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}

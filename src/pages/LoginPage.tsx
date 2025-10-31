import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const handleLogin = async (user: string, pass: string) => {
    // Aquí podrías conectar tu API real después
    console.log("Usuario:", user, "Contraseña:", pass);
    alert("Inicio de sesión simulado exitoso");
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-light pt-10 px-4 overflow-auto">
      <div className="w-full max-w-md text-center mb-8">
        
          <h1 className="text-4xl font-bold text-primary mb-2">Clínica Odontológica</h1>
          <p className="text-accent text-lg">Bienvenido, por favor inicia sesión</p>
        
	<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 max-h-[90vh]">
        <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
}
